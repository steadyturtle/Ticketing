import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    data: {},
    onSuccess: () => Router.push("/auth/signout"),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>You are signed out</div>;
};
