# Authored by Ali and Mack

from html.parser import \
    HTMLParser  # docs at https://docs.python.org/3/library/html.parser.html

# HTML FORMAT NOTES:
# courses start at first html table row without any <th> tags
# windowIdx is the id for each course, will help us find courses in the html document


# the following dictionary contains strings found in html tag id or class attributes, using the data that these strings represent as
# keys to greatly aid in readability throughout the parser
data_type_identifiers = {
    'term' : 'WSS_COURSE_SECTIONS_',
    'status' : 'LIST_VAR1_',
    'location' : 'SEC_LOCATION_',
    'meeting' : 'meet',
    'prof' : 'SEC_FACULTY_INFO_',
    'available_capacity' : 'LIST_VAR5_',
    'credits' : 'SEC_MIN_CRED_',
    'section_title' : 'SEC_SHORT_TITLE',
    'level' : 'SEC_ACAD_LEVEL_'
}

class HTMLCourseParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)

        # dictionary for each class section and each meeting time
        self.section_dict = {
            'meeting': [],
            'available': 0,
            'capacity': 0
        }

        self.meeting_dict = {}

        # flags and other variables
        self.current_data = ''
        self.meeting_info_count = 0

        self.json_dict = {}
        self.course_mappings = {}

    def get_course_dict(self):
        return self.json_dict

    def get_course_mapping(self):
        return self.course_mappings
    
    def handle_starttag(self, tag, attrs):
        
        if len(attrs) > 0:
            # find attribute names in tuples list
            attr_names = [attr[0] for attr in attrs]

            if tag == 'p' and 'id' in attr_names and attrs[attr_names.index('id')]:
                attr_value = attrs[attr_names.index('id')][1]

                if attr_value.startswith(data_type_identifiers['term']):
                    self.current_data = 'term'
                elif attr_value.startswith(data_type_identifiers['status']):
                    self.current_data = 'status'
                elif attr_value.startswith(data_type_identifiers['location']):
                    self.current_data = 'location'
                elif attr_value.startswith(data_type_identifiers['prof']):
                    self.current_data = 'prof'
                elif attr_value.startswith(data_type_identifiers['available_capacity']):
                    self.current_data = 'available_capacity'
                elif attr_value.startswith(data_type_identifiers['credits']):
                    self.current_data = 'credits'
                elif attr_value.startswith(data_type_identifiers['level']):
                    self.current_data = 'level'

            elif tag == 'a' and 'id' in attr_names:
                attr_value = attrs[attr_names.index('id')][1]
                
                if attr_value.startswith(data_type_identifiers['section_title']):
                    self.current_data = 'section_title'

            elif tag == 'div' and 'class' in attr_names and attrs[attr_names.index('class')][1].startswith(data_type_identifiers['meeting']):
                self.current_data = 'meeting'
    
    def handle_data(self, data):
        if self.current_data == 'term':
            self.section_dict['term'] = data
            self.current_data = ''

        elif self.current_data == 'status':
            self.section_dict['status'] = data
            self.current_data = ''

        elif self.current_data == 'section_title':
            tokens = data.replace('*', '(').replace(')', '(')
            tokens = tokens.split('(')
            
            self.section_dict['department'] = tokens[0]
            self.section_dict['courseCode'] = tokens[1]
            self.section_dict['section'] = tokens[2]
            self.section_dict['num'] = tokens[3]
            self.section_dict['courseName'] = tokens[4].strip()
            self.current_data = ''

        elif self.current_data == 'location':
            self.section_dict['location'] = data
            self.current_data = ''
            
        elif self.current_data == 'meeting':
            if self.meeting_info_count == 0:
                if len(data.strip()) > 0:
                    tokens = data.split(' ')
                    self.meeting_dict['meeting_type'] = tokens[0]

                    #if meetings are on multiple days all the rest of the tokens will be days
                    day_string = ''
                    for i in range(1, len(tokens)):
                        day_string += tokens[i]

                    self.meeting_dict['meeting_day'] = day_string

                    self.meeting_info_count += 1
                else:
                    self.current_data = ''

            elif self.meeting_info_count == 1:
                if data.strip() == 'Times TBA':
                    #both keys are given the Times TBA values to avoid using null values
                    self.meeting_dict['start_time'] = data
                    self.meeting_dict['end_time'] = data
                else:
                    tokens = data.split('-')
                    self.meeting_dict['start_time'] = tokens[0].strip()
                    self.meeting_dict['end_time'] = tokens[1].strip()

                self.meeting_info_count += 1

            elif self.meeting_info_count == 2:
                if data == 'Room TBA':
                    # This is an edge case, if this string is found instead of a building name then an appropriate value is added to the dictionary
                    self.meeting_dict['building'] = 'Building TBA'
                else:
                    self.meeting_dict['building'] = data.strip()
                self.meeting_info_count += 1
            
            elif self.meeting_info_count == 3:
                if self.meeting_dict['building'] == 'Building TBA':
                    self.meeting_dict['room'] = 'Room TBA'
                else:
                    self.meeting_dict['room'] = data.strip(', ')

                # meeting dictionary is added to the array of meetings
                self.section_dict['meeting'].append(self.meeting_dict.copy())

                # meeting dictionary is cleared for the next meeting
                self.meeting_dict.clear()
                self.meeting_info_count = 0
                self.current_data = ''

        elif self.current_data == 'prof':
            self.section_dict['faculty'] = data
            self.current_data = ''

        elif self.current_data == 'available_capacity' and len(data.strip()) > 0:
            tokens = data.split('/')
            self.section_dict['available'] = tokens[0].strip()
            self.section_dict['capacity'] = tokens[1].strip()
            self.current_data = ''

        elif self.current_data == 'credits':
            self.section_dict['credits'] = data
            self.current_data = ''

        elif self.current_data == 'level':
            #this is the last peice of info we parse before moving on to a new section
            self.section_dict['academicLevel'] = data

            coursekey = self.section_dict['department'] + self.section_dict['courseCode']

            if coursekey not in self.json_dict:
                self.json_dict[coursekey] = []

            self.json_dict[coursekey].append(self.section_dict.copy()) # section dictionary is added to the array of sections

            self.course_mappings[self.section_dict['courseName'].upper()] = coursekey

            self.section_dict = {
                'meeting': [],
                'available': 0,
                'capacity': 0
            }

            self.current_data = ''
