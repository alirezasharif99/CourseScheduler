import React from 'react';
import SectionToggle from './SectionToggle';

const CourseSections = ({ sections }) => {
  return (
    <div className='list-group'>
      {sections.map((section) => (
        <li key={section.section_id} className='list-group-item p-3'>
          <h5 className='mb-0'>
            {section.section}
            <SectionToggle section={section} />
          </h5>
          <br />
          <strong>Term</strong>: {section.sem}
          <br />
          <strong>Status</strong>: {section.status}
          <br />
          <strong>Faculty</strong>: {section.faculty}
          <br />
          <strong>Availability</strong>: {section.available} / {section.capacity}
          <br />
          <ul className='list-group list-group-flush'>
            {section.meetings &&
              section.meetings.map((meeting, i) => (
                <li key={`meeting-${section.section_id}-${i}`} className='list-group-item px-1'>
                  <small>
                    <strong>{meeting.meeting_type}</strong>
                  </small>
                  <br />
                  {meeting.meeting_day} {meeting.start_time}-{meeting.end_time} {meeting.exam_date} ({meeting.building} {meeting.room})
                </li>
              ))}
          </ul>
        </li>
      ))}
    </div>
  );
};

export default CourseSections;
