import React, { useEffect, useRef, useContext } from 'react';
import { DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import { ScheduleContext } from '../contexts/ScheduleContext';

const Schedule = ({ config }) => {
  const { schedule, getSchedule, currentSem, semesters, removeSection, isConflict } = useContext(ScheduleContext);

  const calendarRef = useRef(null);

  const date = new Date().toJSON().slice(0, 10);
  const calendarConfig = {
    viewType: 'Resources',
    startDate: date,
    businessBeginsHour: 8,
    businessEndsHour: 23,
    heightSpec: 'BusinessHours',
    cellHeight: 20,
    columns: [
      { name: 'Monday', id: 'mon' },
      { name: 'Tuesday', id: 'tues' },
      { name: 'Wednesday', id: 'wed' },
      { name: 'Thursday', id: 'thur' },
      { name: 'Friday', id: 'fri' }
    ],
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
    let meetings = [];
    sections.forEach((s) => {
      s.meetings.forEach((meeting) => {
        if (meeting.meeting_type === 'Distance') return;
        if (meeting.meeting_type === 'EXAM') return;
        if (meeting.meeting_day.includes('TBA')) return;

        const days = meeting.meeting_day.split(',');

        days.forEach((day) => {
          let toAdd = {
            id: meetings.length + 1,
            sectionId: s.section_id,
            html: `${s.department}*${s.course_code}*${s.section} - ${meeting.meeting_type}<br />${meeting.building} ${meeting.room}`,
            start: date + 'T' + meeting.start_time,
            end: date + 'T' + meeting.end_time,
            barColor: '#fcb711',
            resource: day.toLowerCase(),
            ...eventConfig
          };

          if (isConflict(s)) {
            toAdd.backColor = 'rgba(250, 75, 35, 0.64)';
          }

          meetings.push(toAdd);
        });
      });
    });

    calendarRef.current.control.update({
      events: meetings
    });

    calendarRef.current.control.onEventClicked = (args) => {
      if (window.confirm('Are you sure you want to remove this section?')) {
        removeSection(args.e.data.sectionId);
      }
    };
  };

  return (
    <div>
      <DayPilotCalendar {...calendarConfig} ref={calendarRef} />
    </div>
  );
};

export default Schedule;
