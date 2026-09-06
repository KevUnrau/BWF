import { useApi } from "../api/client";
import { useState } from "react";
function Invitation({
  id,
  userId,
  invitedBy,
  groupId,
  groupName,
  responseStatus,
  invitationCreated,
  invitationExpires,
  respondedAt,
}) {
  const { apiFetch } = useApi();
  const [status, setStatus] = useState(responseStatus);
  const [responseDate, setResponseDate] = useState(new Date(respondedAt));

  async function handleInvitationResponse(response) {
    const body = {
      invitationId: id,
      groupId: groupId,
      status: response,
      userId: userId,
    };
    try {
      await apiFetch("/groups/invitations/response", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setResponseDate(new Date());
      setStatus(`${response}ed`);
    } catch (error) {
      console.error(error.message);
    }
  }

  const createdDate = new Date(invitationCreated);
  const expiresDate = new Date(invitationExpires);

  if (status !== "open") {
    return (
      <div className="flex border rounded-sm p-1 m-1">
        <p>
          {invitedBy} asked you to join Group {groupName} on{" "}
          {createdDate.toDateString()}. You {status} on{" "}
          {responseDate.toDateString()}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex border rounded-sm p-1 m-1">
      <p>
        {invitedBy} asked you to join Group {groupName} on{" "}
        {createdDate.toDateString()}. Invitation expires on{" "}
        {expiresDate.toDateString()}.
      </p>
      <button
        className="ml-auto"
        onClick={() => {
          handleInvitationResponse("accept");
        }}
      >
        ✅
      </button>
      <button
        className="ms-2"
        onClick={() => {
          handleInvitationResponse("decline");
        }}
      >
        ❌
      </button>
    </div>
  );
}

export default Invitation;
