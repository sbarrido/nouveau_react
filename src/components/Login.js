import React from "react";

function Login(props) {
  return (
    <div className="card w-100 text-center border-white">
      <div className="row">
        <div className="col-12">
          <h5>Enter Username</h5>
        </div>
        <div className="d-flex justify-content-center py-1">
          <div className="col-4">
            <input
              type="text"
              name="username"
              value={props.newUser}
              className="form-control mb-3"
              placeholder="Username"
              onChange={props.handleChange}
              onKeyDown={(e) =>
                e.code === "Enter" ? props.logNewUser() : null
              }
            />
            <button
              className="btn btn-success w-100"
              onClick={props.logNewUser}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
