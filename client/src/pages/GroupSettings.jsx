import AddMember from "../components/AddMember";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";

function GroupSettings() {
  const { groupId } = useParams();
  const { user } = useAuth();

  return (
    <AddMember
      groupId={Number(groupId)}
      currentUserId={Number(user.id)}
    ></AddMember>
  );
}

export default GroupSettings;
