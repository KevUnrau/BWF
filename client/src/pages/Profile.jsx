import { useAuth } from "../context/AuthContext";
import SignUp from "../components/SignUp";

function Profile() {
  const { user } = useAuth();
  return user?.username ? (
    <>
      <p>Hello {user.username}</p>
    </>
  ) : (
    <SignUp></SignUp>
  );
}

export default Profile;
