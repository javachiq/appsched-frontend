import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form }  from "react-bootstrap";

import _ from "lodash";
import moment from "moment";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

const Register = (props) => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
  } = useForm();

 const onSubmit = (data) => {
  AuthService.register(data).then(
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
      <header className="jumbotron">
        <h3>Register User</h3>
      </header>
      <div className="col-md-12">
        <div className="card card-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Form.Group className="mb-3" controlId="patient">
                <Form.Label>Username</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="email" placeholder="Enter username" {...field}/>}
                  name="username"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="doctorId">
                <Form.Label>First Name</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="text" placeholder="" {...field}/>}
                  name="firstName"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Last Name</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="text" placeholder="" {...field}/>}
                  name="lastName"
                  control={control}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Password</Form.Label>
                <Controller
                  render={({ field }) => <Form.Control type="password" placeholder="" {...field}/>}
                  name="password"
                  control={control}
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

export default Register;
