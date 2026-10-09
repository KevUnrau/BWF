import AddMember from "../components/AddMember";
import RemoveMember from "../components/RemoveMember";
import AddSession from "../components/AddSession";
import RemoveSession from "../components/RemoveSession";
import { useApi } from "../api/client";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useFetchData } from "../hooks/useFetchData";

function GroupSettings() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { apiFetch } = useApi();
  const navigate = useNavigate();
  const {
    data: role,
    loading,
    error,
  } = useFetchData(user && groupId ? `/groups/${groupId}/userrole` : null);

  async function handleDelete() {
    try {
      await apiFetch(`/groups?id=${groupId}`, { method: "DELETE" });
      navigate("/group");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLeave() {
    try {
      await apiFetch(`/groups/${groupId}/leave`, { method: "DELETE" });
      navigate("/group");
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) {
    return <p>Please sign in to view group settings.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch group member role.</p>;
  }

  if (!role) {
    return <p>User role not found.</p>;
  }

  if (role.name === "admin") {
    return (
      <>
        <h2>Members</h2>
        <AddMember groupId={Number(groupId)}></AddMember>
        <RemoveMember groupId={Number(groupId)}></RemoveMember>
        <h2>Sessions</h2>
        <AddSession groupId={Number(groupId)}></AddSession>
        <RemoveSession groupId={Number(groupId)}></RemoveSession>
        <h2>General</h2>
        <button onClick={handleLeave} className="mr-1">
          Leave Group
        </button>
        <button onClick={handleDelete}>Delete Group</button>
      </>
    );
  }

  return (
    <>
      <h2>General</h2>
      <button onClick={handleLeave} className="mr-1">
        Leave Group
      </button>
    </>
  );
}

export default GroupSettings;
