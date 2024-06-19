import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

//import DepartmentCourses from './DepartmentCourses';

const AdvFilters = (props) => {
  const [departments, setDepartments] = useState([]);
  const [currentDept, setCurrentDept] = useState(null);

  //we have a state for each checkbox
  const [mon, setMon] = useState(true);
  const [tue, setTue] = useState(true);
  const [wed, setWed] = useState(true);
  const [thu, setThu] = useState(true);
  const [fri, setFri] = useState(true);

  const [morn, setMorn] = useState(true);
  const [aft, setAft] = useState(true);
  const [eve, setEve] = useState(true);

  const [level1000, setLevel1000] = useState(true);
  const [level2000, setLevel2000] = useState(true);
  const [level3000, setLevel3000] = useState(true);
  const [level4000, setLevel4000] = useState(true);
  const [grad, setGrad] = useState(true);

  const [tba, setTba] = useState(true);
  const [de, setDe] = useState(true);

  const [filterObject, setFilterObject] = useState(props.filterObject);

  const toggleMon = () => {
    setMon(!mon);
  };

  const toggleTue = () => {
    setTue(!tue);
  };

  const toggleWed = () => {
    setWed(!wed);
  };

  const toggleThu = () => {
    setThu(!thu);
  };

  const toggleFri = () => {
    setFri(!fri);
  };

  const toggleMorn = () => {
    setMorn(!morn);
  };

  const toggleAft = () => {
    setAft(!aft);
  };

  const toggleEve = () => {
    setEve(!eve);
  };

  const toggleLevel1000 = () => {
    setLevel1000(!level1000);
  };

  const toggleLevel2000 = () => {
    setLevel2000(!level2000);
  };

  const toggleLevel3000 = () => {
    setLevel3000(!level3000);
  };

  const toggleLevel4000 = () => {
    setLevel4000(!level4000);
  };

  const toggleGrad = () => {
    setGrad(!grad);
  };

  const toggleTba = () => {
    setTba(!tba);
  };

  const toggleDe = () => {
    setDe(!de);
  };

  useEffect(() => {
    let tempDays = [];
    if (!mon) tempDays.push("Mon");
    if (!tue) tempDays.push("Tues");
    if (!wed) tempDays.push("Wed");
    if (!thu) tempDays.push("Thur");
    if (!fri) tempDays.push("Fri");
    if (!tba) tempDays.push("DaysTBA");
    if (!de) tempDays.push("EducationDaysTBA");
    let tempObject = filterObject;
    tempObject.days = tempDays;
    //console.log(tempObject);
    setFilterObject(tempObject);
    //console.log(filterObject);
    props.setFilterFunction(filterObject);
  }, [
    toggleMon,
    toggleTue,
    toggleWed,
    toggleThu,
    toggleFri,
    toggleTba,
    toggleDe,
  ]);

  useEffect(() => {
    let tempTimes = [];
    if (!morn) tempTimes.push(["08:30", "12:00"]);
    if (!aft) tempTimes.push(["12:00", "17:00"]);
    if (!eve) tempTimes.push(["17:00", "22:00"]);
    let tempObject = filterObject;
    tempObject.times = tempTimes;
    setFilterObject(tempObject);
    props.setFilterFunction(filterObject);
  }, [toggleMorn, toggleAft, toggleEve]);

  useEffect(() => {
    let tempLevel = [level1000, level2000, level3000, level4000, grad];
    let tempObject = filterObject;
    tempObject.levels = tempLevel;
    setFilterObject(tempObject);
    props.setFilterFunction(filterObject);
  }, [
    toggleLevel1000,
    toggleLevel2000,
    toggleLevel3000,
    toggleLevel4000,
    toggleGrad,
  ]);

  useEffect(() => {
    getDepartments();
    document.getElementById("Mon").checked = true;
    document.getElementById("Tues").checked = true;
    document.getElementById("Wed").checked = true;
    document.getElementById("Thur").checked = true;
    document.getElementById("Fri").checked = true;

    document.getElementById("Morn").checked = true;
    document.getElementById("Aft").checked = true;
    document.getElementById("Eve").checked = true;

    document.getElementById("1000").checked = true;
    document.getElementById("2000").checked = true;
    document.getElementById("3000").checked = true;
    document.getElementById("4000").checked = true;
    document.getElementById("Grad").checked = true;

    document.getElementById("TBA").checked = true;
    document.getElementById("DE").checked = true;
  }, []);

  const getDepartments = async () => {
    const res = await axios.get("/api/departments");
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
        //<DepartmentCourses dept={currentDept} backFn={clearDepartment} />
        <a>
          hello{clearDepartment}
          {departments}
          {setDepartment}
        </a>
      ) : (
        <>
          <div>
            <strong>
              <h6 className="my-2">
                {" "}
                Days of the Week
                <br />
                <label className="mx-1 mt-2" htmlFor="accept">
                  <input
                    type="checkbox"
                    id="Mon"
                    name="Mon"
                    value="yes"
                    onChange={toggleMon}
                  ></input>{" "}
                  Monday
                </label>
                <label className="mx-1 mt-2" htmlFor="accept">
                  <input
                    type="checkbox"
                    id="Tues"
                    name="Tues"
                    value="yes"
                    onChange={toggleTue}
                  ></input>{" "}
                  Tuesday
                </label>
                <label className="mx-1 mt-2" htmlFor="accept">
                  <input
                    type="checkbox"
                    id="Wed"
                    name="Wed"
                    value="yes"
                    onChange={toggleWed}
                  ></input>{" "}
                  Wednesday
                </label>
                <label className="mx-1 mt-2" htmlFor="accept">
                  <input
                    type="checkbox"
                    id="Thur"
                    name="Thur"
                    value="yes"
                    onChange={toggleThu}
                  ></input>{" "}
                  Thursday
                </label>
                <label className="mx-1 mt-2" htmlFor="accept">
                  <input
                    type="checkbox"
                    id="Fri"
                    name="Fri"
                    value="yes"
                    onChange={toggleFri}
                  ></input>{" "}
                  Friday
                </label>
              </h6>
            </strong>
            <h6>
              {" "}
              Time of Day
              <br />
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="Morn"
                  name="Morn"
                  value="yes"
                  onChange={toggleMorn}
                ></input>{" "}
                Morning Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="Aft"
                  name="Aft"
                  value="yes"
                  onChange={toggleAft}
                ></input>{" "}
                Afternoon Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="Eve"
                  name="Eve"
                  value="yes"
                  onChange={toggleEve}
                ></input>{" "}
                Evening Courses
              </label>
            </h6>
            <h6>
              {" "}
              Course Level
              <br />
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="1000"
                  name="1000"
                  value="yes"
                  onChange={toggleLevel1000}
                ></input>{" "}
                1000 Level Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="2000"
                  name="2000"
                  value="yes"
                  onChange={toggleLevel2000}
                ></input>{" "}
                2000 Level Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="3000"
                  name="3000"
                  value="yes"
                  onChange={toggleLevel3000}
                ></input>{" "}
                3000 Level Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="4000"
                  name="4000"
                  value="yes"
                  onChange={toggleLevel4000}
                ></input>{" "}
                4000 Level Courses
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="Grad"
                  name="Grad"
                  value="yes"
                  onChange={toggleGrad}
                ></input>{" "}
                Graduate Courses
              </label>
            </h6>
            <h6>
              {" "}
              Other
              <br />
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="TBA"
                  name="TBA"
                  value="yes"
                  onChange={toggleTba}
                ></input>{" "}
                Meeting Days TBA
              </label>
              <label className="mx-1 mt-2" htmlFor="accept">
                <input
                  type="checkbox"
                  id="DE"
                  name="DE"
                  value="yes"
                  onChange={toggleDe}
                ></input>{" "}
                DE Courses
              </label>
            </h6>
          </div>
        </>
      )}
    </>
  );
};

export default AdvFilters;
