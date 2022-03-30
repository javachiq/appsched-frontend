import React, { useState, useEffect } from "react";

import SchedulerService from "../services/scheduler.service";
import DoctorService from "../services/doctor.service";
import AuthService from "../services/auth.service";

import EventBus from "../common/EventBus";
import _ from "lodash";
import moment from "moment";

const Appointments = (props) => {
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [isDoctor, setIsDoctor] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    SchedulerService.getAppointments()
      .then((response) => response.data)
      .then((json) => {

        setData(json)
      })
      .catch((error) => {
        if (error.response.status === 403) {
          // TO DO Update to Factory
          DoctorService.getAppointments()
          .then((response) => response.data)
          .then((json) => {
            setData(json);
            setIsDoctor(true);
          })
            .catch((error) => {
            setData(null)
            const _content =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            setData(_content);

            if (error.response && error.response.status === 401) {
              EventBus.dispatch("logout");
            }
          });
        }
      });
  }, [user, message]);

  const handleApprove = (e) => {
    const id = (e.target.value);
    DoctorService.approveAppointment(id).then(
        (response) => {
         setMessage(response.data.message);
         setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
  };


  const handleEdit = (e) => {
    const id = (e.target.value);
    props.history.push({
      pathname: '/appointment',
      search: `${id}`,
    });
  };

  const handleDelete = (e) => {
    const id = (e.target.value);
    SchedulerService.postDeleteAppointment(id).then(
        (response) => {
          setMessage(response.data.message);
         setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
  };

  return (
    <div className="container">
                {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
      <table className="table table-hover table-light table-sm">
          <thead className="thead-light">
            <tr>
              <th scope="col">Schedule</th>
              <th scope="col">Patient</th>
            {!isDoctor && <th scope="col">Doctor</th>}
            <th scope="col">Status</th>
            <th scope="col">Action</th>
            </tr>
          </thead>
        <tbody>
          {data ? (
            _.map(data, (obj) => {
              return (
                <tr key={ obj.id }>
                  <td scope="row">{ moment(obj.slot).format('MMMM DD, YYYY hh:mm A') }</td>
                  <td>{obj.patient}</td>
                  {!isDoctor && <td>{obj.doctorId}</td>}
                  <td>{obj.status}</td>
                  <td>
                    {!isDoctor && (obj.status !== 'APPROVED') &&
                      <button value={obj.id} onClick={handleEdit} className="btn btn-primary btn-block">EDIT</button>}
                    {!isDoctor && (obj.status !== 'APPROVED') &&
                      <button value={obj.id} onClick={handleDelete} className="btn btn-primary btn-block">DELETE</button>}
                    {isDoctor && (obj.status !== 'APPROVED') &&
                      <button value={obj.id} onClick={handleApprove} className="btn btn-primary btn-block">Approve</button>}
                  </td>
                </tr>
              )
            })) : (
            <tr><td>No Data</td></tr>
          )}
          </tbody>
        </table>
    </div>
  );
};

export default Appointments;
