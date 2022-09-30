import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
  //console.log("current user : ", currentUser);
  return currentUser ? (
    <h4>You are signed in</h4>
  ) : (
    <h4>You are not signed in</h4>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client
    .get("/api/users/currentuser")
    .catch((err) => console.log("err ", err));
  console.log("data ", data);
  return data;
};
export default LandingPage;
