import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p>Please sign in to view your profile.</p>;
  }
  return <p>Hello {user.username}</p>;
}

export default Profile;
