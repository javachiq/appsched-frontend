import React, { useState, useEffect } from "react";

import AdminService from "../services/admin.service";
import EventBus from "../common/EventBus";
import _ from "lodash";

const Admin = () => {
  const [data, setData] = useState({});
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    AdminService.getUsers()
      .then((response) => response.data)
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
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
      }
    );
  }, []);

    const handleEdit = (e) => {
    const id = (e.target.value);
    // props.history.push({
    //   pathname: '/appointment',
    //   search: `${id}`,
    // });
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
            <th scope="col">Username</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
            </tr>
          </thead>
        <tbody>
          {data ? (
            _.map(data, (obj) => {
              return (
                <tr key={ obj.id }>
                  <td>{obj.username}</td>
                  <td>{obj.firstName}</td>
                  <td>{obj.lastName}</td>
                  <td>{obj.roles[0].name.toUpperCase()}</td>
                  <td>
                    <button value={obj.id} onClick={handleEdit} className="btn btn-primary btn-block">EDIT</button>
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

export default Admin;
