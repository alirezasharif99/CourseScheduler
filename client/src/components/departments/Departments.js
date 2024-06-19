import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

import DepartmentCourses from './DepartmentCourses';

const Departments = ({ backFn }) => {
  const [departments, setDepartments] = useState([]);
  const [currentDept, setCurrentDept] = useState(null);

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = async () => {
    const res = await axios.get('/api/departments');
    setDepartments(res.data);
  };

  const setDepartment = (dept) => {
    setCurrentDept(dept);
  };

  const clearDepartment = () => {
    setCurrentDept(null);
  };

  return (
    <>
      {currentDept ? (
        <DepartmentCourses dept={currentDept} backFn={clearDepartment} />
      ) : (
        <>
          <div className='d-grid'>
            <button className='btn btn-primary rounded-0 rounded-top' onClick={() => backFn()}>
              Back
            </button>
          </div>
          <div className='departmentsList list-group list-group-flush rounded-bottom'>
            {departments.map((dept) => (
              <a href='#' className='list-group-item list-group-item-action' key={dept.name} onClick={() => setDepartment(dept.name)}>
                {dept.name} <span className='badge rounded-pill text-bg-secondary float-end'>{dept.count}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Departments;
