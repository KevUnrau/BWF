import AddMember from "../components/AddMember";
import RemoveMember from "../components/RemoveMember";
import AddSession from "../components/AddSession";
import RemoveSession from "../components/RemoveSession";
import Button from "../components/Button";
import { useApi } from "../api/client";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useFetchData } from "../hooks/useFetchData";
import { useToast } from "../context/ToastContext";

function GroupSettings() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { apiFetch } = useApi();
  const { toast } = useToast();
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
      toast.error(error.message);
    }
  }

  async function handleLeave() {
    try {
      await apiFetch(`/groups/${groupId}/leave`, { method: "DELETE" });
      navigate("/group");
    } catch (error) {
      toast.error(error.message);
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
        <Button onClick={handleLeave} variant="danger">
          Leave Group
        </Button>
        <Button onClick={handleDelete} variant="danger">
          Delete Group
        </Button>
      </>
    );
  }

  return (
    <>
      <h2>General</h2>
      <Button onClick={handleLeave} variant="danger">
        Leave Group
      </Button>
    </>
  );
}

export default GroupSettings;
