import { useAuth } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData.js";
import { useApi } from "../api/client.js";
import { useToast } from "../context/ToastContext.jsx";
import Invitation from "../components/Invitation.jsx";

function Notification() {
  const { user } = useAuth();
  const {
    data: notifications,
    setData: setNotifications,
    loading,
    error,
  } = useFetchData(user ? `/invitations` : null);
  const { apiFetch } = useApi();
  const { toast } = useToast();

  async function handleDelete(id) {
    try {
      await apiFetch(`/invitations?id=${id}`, { method: "DELETE" });
      const notifications = setNotifications((prev) => {
        prev.filter((notification) => {
          return notification.id !== id;
        });
      });
      setNotifications(notifications);
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (!user) {
    return <p>Please sign in to view your notifications.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch notifications.</p>;
  }

  if (!notifications || notifications.length === 0) {
    return <p>No notifications found.</p>;
  }

  const invitations = notifications
    .sort((a, b) => {
      if (a.created_at > b.created_at) {
        return -1;
      } else {
        return 1;
      }
    })
    .map((notification) => {
      return (
        <li key={`invitation-${notification.id}`}>
          <Invitation
            id={notification.id}
            invitationCreated={notification.created_at}
            groupId={notification.group_id}
            groupName={notification.groups.name}
            responseStatus={notification.invitation_status.name}
            invitationExpires={notification.expires_at}
            invitedBy={
              notification.users_invitations_invited_by_user_idTousers.username
            }
            respondedAt={notification.responded_at}
            readAt={notification.read_at}
            deleteHandler={handleDelete}
          ></Invitation>
        </li>
      );
    });

  const list = <ol>{invitations}</ol>;

  return list;
}

export default Notification;
