import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Doctor = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getModeratorBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
              <table className="table table-hover table-light table-sm">
          <thead className="thead-light">
            <tr>
              <th scope="col">Schedule</th>
              <th scope="col">Patient</th>
              <th scope="col">Doctor</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
            <td>Confirmed</td>
            <td>Edit / Delete</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
            <td>Pending Approval</td>
          <td>Edit / Delete</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td colspan="2">Larry the Bird</td>
            <td>Cancelled</td>
            <td>Edit / Delete</td>
            </tr>
          </tbody>
        </table>
    </div>
  );
};

export default Doctor;
