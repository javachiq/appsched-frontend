import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BoardAdmin from "./pages/BoardAdmin";
import Doctor from "./pages/Doctor";
import BoardUser from "./pages/BoardUser";
import Appointments from "./pages/Appointments";
import Appointment from "./pages/Appointment";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {
  const [showSchedulerBoard, setShowSchedulerBoard] = useState(false);
  const [showDoctorBoard, setShowDoctorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowSchedulerBoard(user.roles.includes("ROLE_SCHEDULER"));
      setShowDoctorBoard(user.roles.includes("ROLE_DOCTOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowSchedulerBoard(false);
    setShowDoctorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <Link to={"/home"} className="navbar-brand">
          AppSched
        </Link>
        <div className="navbar-nav mr-auto">
          {(showSchedulerBoard || showDoctorBoard) && (
            <li className="nav-item">
              <Link to={"/appointments"} className="nav-link">
                Appointments
              </Link>
            </li>
          )}

          {showSchedulerBoard && (
            <li className="nav-item">
              <Link to={{ pathname: "/appointment", search: "new" }} className="nav-link">
                New
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.firstName}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/appointments" component={Appointments} />
          <Route exact path="/appointment" component={Appointment} />
          <Route path="/user" component={BoardUser} />
          <Route path="/admin" component={BoardAdmin} />
        </Switch>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
