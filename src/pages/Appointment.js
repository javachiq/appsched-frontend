import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form }  from "react-bootstrap";

import _ from "lodash";
import moment from "moment";
// import Form from "react-validation/build/form";
// import Input from "react-validation/build/input";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import SchedulerService from "../services/scheduler.service";

// import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
// import CONFIG from "../config/config";

// const required = (value) => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This field is required!
//       </div>
//     );
//   }
// };

const Appointment = (props) => {
  let minHour = new Date();
  minHour.setHours(8);
  let maxHour = new Date();
  maxHour.setHours(16);

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
  } = useForm();
 const onSubmit = (data) => {
   console.log('data', data.slot);
   _.set(data, 'slot', Date.parse(data.slot));
   console.log('new data', data.slot);
   if (!isUpdate) {
    SchedulerService.postCreateAppointment(data).then(
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
   } else {
         SchedulerService.postUpdateAppointment(data).then(
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
   }
  };


  // const onChangePatient = (e) => {
  //   const patient = e.target.value;
  //   setPatient(patient);
  // };

  // const onChangeDoctorId = (e) => {
  //   const doctorId = e.target.value;
  //   setDoctorId(doctorId);
  // };

  useEffect(() => {
    const appId = props.history.location.search.substring(1);
    if (!_.includes(appId, "new")) {
      setIsUpdate(true);
      console.log(appId);
      if (appId) {
        SchedulerService.getAppointment(appId)
        .then((response) => response.data)
        .then((json) => {
          console.log(json[0].patient);
          reset({...json[0]});
            })
              .catch((error) => {
              const _content =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
                setMessage(_content);

              if (error.response && error.response.status === 401) {
                EventBus.dispatch("logout");
              }
            });
      } 
    }
  }, [props.history.location.search, reset]);
  
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Create Appointment</h3>
      </header>
      <div className="col-md-12">
        <div className="card card-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Form.Group className="mb-3" controlId="patient">
                <Form.Label>Patient Name</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="text" placeholder="Enter patient name" {...field}/>}
                  name="patient"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="doctorId">
                <Form.Label>Doctor Id</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="text" placeholder="" {...field}/>}
                  name="doctorId"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Status</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="text" placeholder="" {...field}/>}
                  name="status"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="date">
                <Form.Label>Date</Form.Label>
              <Controller
                control={control}
                name="slot"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DatePicker
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={Date.parse(value)}
                    showTimeSelect
                    timeIntervals={60}
                    minTime={minHour}
                    maxTime={maxHour}
                    dateFormat="MM/dd/yyyy h:mm aa"
                    filterDate={(date) => date.getDay() > 0 && date.getDay() < 7}
                  />
                )}
              />
              </Form.Group>
            </div>

            {isUpdate && <input type="submit" value="Update" />}
             {!isUpdate && <input type="submit" value="Save" />}
        </form>
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
      </div>
    </div>
    </div>
  );
};

export default Appointment;
