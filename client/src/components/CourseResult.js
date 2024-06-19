import React from 'react';
import CourseSections from './CourseSections';

const CourseResult = ({ accordion, data, opened }) => {
  return (
    <div className='accordion-item'>
      {!opened && (
        <h2 className='accordion-header'>
          <button
            className='accordion-button collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target={`#collapse-${data.id}`}
            aria-expanded='false'
            aria-controls={`#collapse-${data.id}`}
          >
            <span className='text-truncate'>
              {data.department}*{data.course_code} - {data.course_name}
            </span>
          </button>
        </h2>
      )}
      <div id={`collapse-${data.id}`} className={`accordion-collapse collapse ${opened ? 'show' : ''}`} data-bs-parent={`#${accordion}-accordion`}>
        <div className='accordion-body'>
          <h4>{data.course_name}</h4>
          <strong>Course Code</strong>: {data.department}*{data.course_code}
          <br />
          <strong>Credits</strong>: {data.credits}
          <br />
          <strong>Academic Level</strong>: {data.academic_level}
          <br />
          <br />
          <h4>Sections</h4>
          <CourseSections sections={data.sections} />
        </div>
      </div>
    </div>
  );
};

export default CourseResult;
