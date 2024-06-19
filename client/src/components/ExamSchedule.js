import React, { useEffect, useRef, useContext } from 'react';
import { DayPilotMonth } from '@daypilot/daypilot-lite-react';
import { ScheduleContext } from '../contexts/ScheduleContext';

const ExamSchedule = ({ config }) => {
  const { schedule, getSchedule, currentSem, semesters, removeSection } = useContext(ScheduleContext);

  const calendarRef = useRef(null);

  const calendarConfig = {
    startDate: new Date('2022-12-01').toJSON().slice(0, 10),
    ...config
  };

  const eventConfig = {
    clickDisabled: false,
    deleteDisabled: false,
    doubleClickDisabled: true,
    moveDisabled: true,
    resizeDisabled: true,
    rightClickDisabled: true
  };

  useEffect(() => {
    updateCalendarData(getSchedule());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, currentSem, semesters]);

  const updateCalendarData = (sections) => {
    let exams = [];
    let month = false;

    sections.forEach((s) => {
      s.meetings.forEach((meeting) => {
        if (meeting.meeting_type !== 'EXAM') return;

        const date = meeting.exam_date;
        month = date.slice(0, 7);

        exams.push({
          id: exams.length + 1,
          sectionId: s.section_id,
          html: `${s.department}*${s.course_code}*${s.section} - ${meeting.meeting_type}`,
          start: date + 'T' + meeting.start_time,
          end: date + 'T' + meeting.end_time,
          ...eventConfig
        });
      });
    });

    calendarRef.current.control.update({
      events: exams
    });

    if (month !== false) {
      calendarRef.current.control.update({
        startDate: month + '-01'
      });
    }

    calendarRef.current.control.onEventClicked = (args) => {
      if (window.confirm('Are you sure you want to remove this section?')) {
        removeSection(args.e.data.sectionId);
      }
    };
  };

  return (
    <div>
      <DayPilotMonth {...calendarConfig} ref={calendarRef} />
    </div>
  );
};

export default ExamSchedule;
