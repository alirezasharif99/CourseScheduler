import React, { useState } from "react";
import "./App.css";
import Schedule from "./components/Schedule";
import { ScheduleContextProvider } from "./contexts/ScheduleContext";
import ExamSchedule from "./components/ExamSchedule";
import SemesterSelector from "./components/SemesterSelector";
import Search from "./components/Search";

function App() {
  const [examView, setExamView] = useState(false);

  let storedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(
    storedTheme === null ? "Dark" : storedTheme
  );

  const switchTheme = () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ScheduleContextProvider>
      <div className="App container-fluid" data-theme={theme}>
        <div className="d-flex flex-column h-100">
          <a className="nav-link" href="#home">
            {/* <img src={logo} className="mt-3 img-fluid" alt="logo" /> */}
            <h1 className="display-1 logo">
              <strong>Course Scheduler</strong>
            </h1>
          </a>
          <div className="container-fluid flex-grow-1">
            <div className="row p-3">
              <div className="col-xl-4 col-xxl-3">
                <Search />
              </div>

              <div className="col-xl-8 col-xxl-9 flex-row-1">
                <SemesterSelector themeFunction={switchTheme} theme={theme} />

                <div className="mt-4">
                  {!examView ? <Schedule /> : <ExamSchedule />}
                  <div className="d-grid">
                    <button
                      className="btn btn-primary rounded-0 rounded-bottom"
                      type="button"
                      onClick={() => setExamView(!examView)}
                    >
                      {!examView
                        ? "View Exam Schedule"
                        : "View Course Schedule"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScheduleContextProvider>
  );
}

export default App;
