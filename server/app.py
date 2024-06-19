import os
from datetime import datetime
import psycopg2
import psycopg2.extras

from flask import Flask, jsonify, json, request

# api config
ENV = os.environ.get('FLASK_ENV', 'production')
PORT = int(os.environ.get('PORT', 3001))
API_PREFIX = '/api' if ENV == 'development' else ''

# db config
DB_HOST = 'db' if ENV == 'development' else 'postgres'
DB_USER = 'postgres'
DB_PASS = os.environ.get('DB_PASS', 'postgres')
DB_DATABASE = 'scheduler'
DB_PORT = 5432

app = Flask(__name__)

def connect_db():
    return psycopg2.connect(database=DB_DATABASE,
                        host=DB_HOST,
                        user=DB_USER,
                        password=DB_PASS,
                        port=DB_PORT)

@app.get(API_PREFIX + "/search")
def get_search():
    args = request.args
    query = args.get('q')
    sem = args.get('sem').upper()

    dept = args.get('dept')
    days = args.get('days')

    times_str = args.get('times')
    levels = args.get('levels')

    #Reference and test values
    #days = ["Fri"]
    #times = [["08:30","10:00")]]
    #levels = [False,False,True,True,True]

    if not dept:
        if len(query) == 0:
            return jsonify([])

        d_day = json.loads(days)
        t_times = json.loads(times_str)
        l_levels = json.loads(levels)

        res = search(query, sem, d_day,t_times,l_levels)
    else:
        res = search_dept(dept, sem)

    return json.dumps(res, indent=4, sort_keys=True, default=str)

def group_by_course(cursor, sections, semester):
    courses = {}
    for i in range(len(sections)):
        course_id = sections[i]['department'] + sections[i]['course_code']
        section = sections[i]

        if course_id not in courses:
            courses[course_id] = {
                'id': len(courses) + 1,
                'course': sections[i]['department'] + sections[i]['course_code'],
                'department': sections[i]['department'],
                'course_code': sections[i]['course_code'],
                'course_name': sections[i]['course_name'],
                'academic_level': sections[i]['academic_level'],
                'credits': sections[i]['credits'],
                'sections': []
            }

        # add meetings to section
        cursor.execute("SELECT * FROM meetings "
                        "WHERE section_id = %s AND sem = %s", (section['section_id'], semester))

        meetings = cursor.fetchall()

        section['meetings'] = meetings
        courses[course_id]['sections'].append(section)

    return list(courses.values())

def search(search_terms, semester,days,times_str,course_level):

    db_conn = connect_db()
    cursor = db_conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    times = None
    if not times_str is None and times_str:
        times = string_to_time(times_str)

    selects = []
    params = []
    queries = search_terms.split(";")

    if (not course_level is None) and course_level:

        c_level = ["1","2","3","4","5","6","7","8"]
        if not course_level[0]:
            c_level[0] = "0"
        if not course_level[1]:
            c_level[1] = "0"
        if not course_level[2]:
            c_level[2] = "0"
        if not course_level[3]:
            c_level[3] = "0"
            c_level[4] = "0"
        if not course_level[4]:
            c_level[5] = "0"
            c_level[6] = "0"
            c_level[7] = "0"

    # select sections
    for query in queries:
        query_selects = []

        if query.strip() == "":
            continue

        # perform query for each search term
        query = query.replace("*", " ")
        query = query.upper()
        terms = query.split()
        for term in terms:
            if term.strip() == "":
                continue
            query_selects.append("(SELECT section_id, department, course_code, course_name, "
                                "TRIM(section) AS section, sem, status, faculty, location, "
                                "available, capacity, credits, academic_level FROM sections "
                                "WHERE ((department || course_code) LIKE %s "
                                "OR UPPER(course_name) LIKE %s "
                                "OR UPPER(faculty) LIKE %s) "
                                "AND sem = %s "
                                ")")
            params.extend([f'%{term}%', f'%{term}%', f'%{term}%', semester])

        selects.append(' INTERSECT '.join(query_selects))

    level_search = ""

    if not course_level is None and course_level:
        level_search = ' OR '.join(["INTERSECT (SELECT section_id, department, course_code, course_name, "
                                "TRIM(section) AS section, sem, status, faculty, location, "
                                "available, capacity, credits, academic_level FROM sections WHERE LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s",
                "LEFT(course_code, 1) = %s)"])
        params.extend([c_level[0],c_level[1],c_level[2],c_level[3],c_level[4],c_level[5],c_level[6],c_level[7]])

    # union all the selects
    final_query ="((" + ' UNION '.join(selects) + ")" + level_search + ") ORDER BY department,course_code ASC"

    cursor.execute(final_query, tuple(params))
    sections = cursor.fetchall()

    # group by course and select meetings for each section found
    courses = {}
    for i in range(len(sections)):
        course_id = sections[i]['department'] + sections[i]['course_code']
        section = sections[i]

        # add meetings to section
        cursor.execute("SELECT * FROM meetings "
                        "WHERE section_id = %s AND sem = %s", (section['section_id'], semester))

        meetings = cursor.fetchall()

        valid_section = True

        # Search the meeting days to see if it is a forbidden day or forbidden time
        if (not days is None) or (not times is None):
            for meeting in meetings:
                if meeting['meeting_type'] != "EXAM":
                    if not days is None and days:
                        meet_days = meeting['meeting_day'].split(",")
                        for day in days:
                            if day in meet_days:
                                valid_section = False
                                break
                    if valid_section and (not times is None) and times:
                        for time in times:
                            if not meeting['start_time'] is None:
                                if time[0] <= meeting['start_time'] < time[1] or time[0] < meeting['end_time'] <= time[1]:
                                    valid_section = False
                                    break
                    else:
                        break

        if valid_section:
            if course_id not in courses:
                courses[course_id] = {
                    'id': len(courses) + 1,
                    'course': sections[i]['department'] + sections[i]['course_code'],
                    'department': sections[i]['department'],
                    'course_code': sections[i]['course_code'],
                    'course_name': sections[i]['course_name'],
                    'academic_level': sections[i]['academic_level'],
                    'credits': sections[i]['credits'],
                    'sections': []
                }

            section['meetings'] = meetings
            courses[course_id]['sections'].append(section)

    db_conn.commit()
    db_conn.close()

    return list(courses.values())

def string_to_time(times_str):
    times = []
    i = 0
    for str_pair in times_str:
        times.append([])
        times[i].append(datetime.strptime(str_pair[0], '%H:%M').time())
        times[i].append(datetime.strptime(str_pair[1], '%H:%M').time())
        i = i + 1
    return times

def search_dept(dept, semester):
    db_conn = connect_db()
    cursor = db_conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    cursor.execute("SELECT section_id, department, course_code, course_name, "
                                "TRIM(section) AS section, sem, status, faculty, location, "
                                "available, capacity, credits, academic_level FROM sections WHERE department = %s AND sem = %s", (dept, semester))
    sections = cursor.fetchall()

    courses = group_by_course(cursor, sections, semester)

    db_conn.commit()
    db_conn.close()

    return courses

@app.get(API_PREFIX + "/semesters")
def get_semesters():
    db_conn = connect_db()
    cursor = db_conn.cursor()

    cursor.execute("SELECT * FROM semesters")
    semesters = cursor.fetchall()
    db_conn.commit()

    response = []
    for data in semesters:
        response.append({
            "sem": data[0],
            "name": data[1]
        })

    # sort response by year then semester (winter, summer, fall)
    alpha = 'WSF'
    response.sort(key=lambda x: (x['sem'][1:], alpha.index(x['sem'][0])))

    db_conn.commit()
    db_conn.close()
    return jsonify(response)

@app.get(API_PREFIX + "/departments")
def get_departments():
    db_conn = connect_db()
    cursor = db_conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    cursor.execute("SELECT department as name, COUNT(course_code) as count "
                   "FROM sections GROUP BY department ORDER BY department ASC")
    departments = cursor.fetchall()

    db_conn.commit()
    db_conn.close()

    return jsonify(departments)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=PORT)
