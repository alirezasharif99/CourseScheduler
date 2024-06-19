import React, { useContext } from 'react';
import { ScheduleContext } from '../contexts/ScheduleContext';
import SectionToggle from './SectionToggle';

const SelectedSections = () => {
  const { getSchedule, clearSchedule } = useContext(ScheduleContext);

  const schedule = getSchedule();

  const totalCredits = () => {
    let totalCredits = 0;
    schedule.map((section) => {
      totalCredits += parseFloat(section.credits);
    })
    return totalCredits;
  };

  return (
    <>
      {schedule.length > 0 && (
        <div className='mb-2'>
          <small>TOTAL CREDITS: </small><span className='badge text-bg-primary'>{totalCredits().toFixed(2)}</span>
        </div>
      )}
      <ul className='list-group'>
        {schedule.map((section) => (
          <li key={section.section_id} className='list-group-item p-3'>
            <h5>
              {section.department}*{section.course_code}*{section.section}: {section.course_name}
              <SectionToggle section={section} />
            </h5>
          </li>
        ))}
        {schedule.length > 0 && (
          <a href='#' className='list-group-item list-group-item-action active text-center' onClick={() => clearSchedule()}>
            Clear Schedule
          </a>
        )}
      </ul>
    </>
  );
};


export default SelectedSections;
