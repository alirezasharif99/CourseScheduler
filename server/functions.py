def format_courses(courses):
    out = []

    for course_code, sections in courses.items():
        section = sections[0]

        course = {
          'id': len(out)+1,
          'course': course_code,
          'courseName': section['courseName'],
          'department': section['department'],
          'courseCode': section['courseCode'],
          'credits': section['credits'],
          'academicLevel': section['academicLevel'],
          'sections': sections
        }

        out.append(course)

    return out
    