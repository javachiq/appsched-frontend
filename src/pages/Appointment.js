import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form }  from "react-bootstrap";

import _ from "lodash";
import moment from "moment";
import ReactSelect from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import SchedulerService from "../services/scheduler.service";
import EventBus from "../common/EventBus";

const Appointment = (props) => {
  let minHour = new Date();
  minHour.setHours(8);
  let maxHour = new Date();
  maxHour.setHours(16);

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const {
    handleSubmit,
    reset,
    control,
  } = useForm();
 const onSubmit = (data) => {
   _.set(data, 'slot', Date.parse(data.slot));
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
  
useEffect(() => {
  SchedulerService.getDoctors()
    .then((response) => response.data)
    .then((json) => {
      const selectValues = _.map(json, (obj) =>{
        return {
          value: obj.id,
          label: `${obj.lastName}, ${obj.firstName}`
        }
      });
      setDoctors(selectValues);
    });
  }, []);
  

  useEffect(() => {
    const appId = props.history.location.search.substring(1);
    if (!_.includes(appId, "new")) {
      setIsUpdate(true);
      if (appId) {
        SchedulerService.getAppointment(appId)
        .then((response) => response.data)
        .then((json) => {
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
                <Form.Label>Doctor</Form.Label>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field: { value } }) => (
                    <ReactSelect
                      value={doctors.find(option => option.value === value)}
                      isClearable
                      options={doctors}
                    />
                  )}
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
                    minDate={moment().toDate()}
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
