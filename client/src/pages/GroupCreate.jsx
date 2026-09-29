import AddGroup from "../components/AddGroup";
import { useAuth } from "../context/AuthContext";
function GroupCreate() {
  const { user } = useAuth();

  if (!user) {
    return <p>Please sign in to create a group.</p>;
  }

  return <AddGroup></AddGroup>;
}

export default GroupCreate;
