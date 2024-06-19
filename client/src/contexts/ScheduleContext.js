import React, { useState, useEffect, createContext } from 'react';

export const ScheduleContext = createContext({});

export const ScheduleContextProvider = (props) => {
  const [schedule, setSchedule] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [currentSem, setCurrentSem] = useState(0);

  // load from local storage on mount
  useEffect(() => {
    const localSchedule = JSON.parse(localStorage.getItem('schedule'));
    if (localSchedule && localSchedule.length > 0) {
      setSchedule(localSchedule);
    }

    const localCurrentSem = JSON.parse(localStorage.getItem('currentSem'));
    if (localCurrentSem) {
      setCurrentSem(localCurrentSem);
    }
  }, []);

  // save to local storage on update
  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));

    localStorage.setItem('currentSem', JSON.stringify(currentSem));
  }, [schedule, semesters, currentSem]);

  const getSchedule = () => {
    if (semesters.length === 0) return [];

    return schedule.filter((section) => section.sem === semesters[currentSem].sem);
  };

  const getMeetingTimes = (meeting) => {
    const today = new Date().toJSON().slice(0, 10);

    const start = new Date(`${today}T${meeting.start_time}`);
    const end = new Date(`${today}T${meeting.end_time}`);

    return [start, end];
  };

  const isInvalidMeeting = (meeting) => {
    if (meeting.meeting_type === 'EXAM') return true;
    if (meeting.meeting_type === 'Distance') return true;
    if (meeting.meeting_day.includes('TBA')) return true;

    return false;
  };

  const addSection = (section) => {
    setSchedule([...schedule, section]);
  };

  const removeSection = (sectionId) => {
    setSchedule(schedule.filter((s) => s.section_id !== sectionId));
  };

  const clearSchedule = () => {
    setSchedule(schedule.filter((section) => section.sem !== semesters[currentSem].sem));
  };

  const isConflict = (section) => {
    for (let meeting of section.meetings) {
      if (isInvalidMeeting(meeting)) continue;

      const [start, end] = getMeetingTimes(meeting);

      for (let sSection of schedule) {
        if (sSection.section_id === section.section_id) continue;

        for (let sMeeting of sSection.meetings) {
          if (meeting.sem != sMeeting.sem) continue;
          if (isInvalidMeeting(sMeeting)) continue;

          const [sStart, sEnd] = getMeetingTimes(sMeeting);

          // check time intersection
          if ((start >= sStart && start <= sEnd) || (end >= sStart && end <= sEnd)) {
            // check date intersection
            const days = meeting.meeting_day.split(',');
            const sDays = sMeeting.meeting_day.split(',');

            if (days.some((day) => sDays.includes(day))) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  return (
    <ScheduleContext.Provider
      value={{ getSchedule, schedule, semesters, setSemesters, currentSem, setCurrentSem, addSection, removeSection, clearSchedule, isConflict }}
    >
      {props.children}
    </ScheduleContext.Provider>
  );
};
