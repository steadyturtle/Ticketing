import { useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    data: { email, password },
    onSuccess: () => Router.push("/"),
  });
  //const onSuccess = () => Router.push("/");
  const handleSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <form className="p-2" onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary mt-2">Sign Up</button>
    </form>
  );
};
