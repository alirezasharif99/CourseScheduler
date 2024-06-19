import React, { useContext, useState } from 'react';
import { ScheduleContext } from '../contexts/ScheduleContext';

const SectionToggle = ({ section }) => {
  const { getSchedule, addSection, removeSection } = useContext(ScheduleContext);
  const [isHovering, setHovering] = useState(false);

  const isSelected = (section) => {
    return getSchedule().filter((s) => s.section_id === section.section_id).length === 1;
  };

  const makeSelection = (section) => {
    if (!isSelected(section)) {
      addSection(section);
    } else {
      removeSection(section.section_id);
    }
  };

  return (
    <button
      type='button'
      className={`btn btn-${!isSelected(section) ? 'outline-success' : isHovering ? 'danger' : 'success'} float-end`}
      onClick={() => makeSelection(section)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <i className={`bi bi-${isSelected(section) ? (isHovering ? 'x-lg' : 'check-circle-fill') : 'circle'}`}></i>
    </button>
  );
};

export default SectionToggle;
