import React, { useEffect, useContext } from "react";
import { ScheduleContext } from "../contexts/ScheduleContext";
import axios from "axios";

const SemesterSelector = (props) => {
  const { semesters, setSemesters, currentSem, setCurrentSem } =
    useContext(ScheduleContext);

  useEffect(() => {
    getSemesters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [props.theme]);

  const getSemesters = async () => {
    const res = await axios.get("/api/semesters");
    setSemesters(res.data);
  };

  const getSemesterName = () => {
    if (semesters.length === 0) return "Loading...";
    return semesters[currentSem].name;
  };

  const nextTerm = () => {
    let next = currentSem + 1;
    if (next === semesters.length) next = currentSem;

    setCurrentSem(next);
  };

  const previousTerm = () => {
    let prev = currentSem - 1;
    if (prev === -1) prev = currentSem;

    setCurrentSem(prev);
  };

  return (
    <>
      <button
        className="btn btn-primary d-inline-block me-2"
        type="button"
        onClick={() => previousTerm()}
        disabled={currentSem === 0}
      >
        <i className={`bi bi-chevron-left`}></i>
      </button>
      <button
        className="btn btn-primary d-inline-block me-2"
        type="button"
        onClick={() => nextTerm()}
        disabled={currentSem === semesters.length - 1}
      >
        <i className={`bi bi-chevron-right`}></i>
      </button>
      {getSemesterName()}
      <button
        className="btn d-inline-block me-2 switch-theme"
        type="button"
        onClick={props.themeFunction}
      >
        {props.theme} Mode
      </button>
    </>
  );
};

export default SemesterSelector;
