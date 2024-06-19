import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

import { ScheduleContext } from '../../contexts/ScheduleContext';
import SearchResults from '../SearchResults';

const DepartmentCourses = ({ dept, backFn }) => {
  const { semesters, currentSem } = useContext(ScheduleContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses();
  }, [currentSem]);

  const getCourses = async () => {
    const res = await axios.get('/api/search', { params: { dept: dept, sem: semesters[currentSem].sem } });
    setCourses(res.data);
  };

  return (
    <>
      <div className='d-grid'>
        <button className='btn btn-primary rounded-0 rounded-top' onClick={() => backFn()}>
          Back
        </button>
      </div>
      {courses.length > 0 && (
        <div className='courseResults rounded-bottom'>
          <SearchResults id='dept_results' results={courses} />
        </div>
      )}
    </>
  );
};

export default DepartmentCourses;
