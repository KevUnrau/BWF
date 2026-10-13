import { useApi } from "../api/client";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import InvitationDeleteButton from "./InvitationDeleteButton";
function Invitation({
  id,
  invitedBy,
  groupId,
  groupName,
  responseStatus,
  invitationCreated,
  invitationExpires,
  respondedAt,
  readAt,
  deleteHandler,
}) {
  const { apiFetch } = useApi();
  const { toast } = useToast();
  const [status, setStatus] = useState(responseStatus);
  const [responseDate, setResponseDate] = useState(new Date(respondedAt));

  async function handleInvitationResponse(response) {
    const body = {
      invitationId: id,
      groupId: groupId,
      status: response,
    };
    try {
      await apiFetch("/invitations/response", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      toast.success(`You joined ${groupName}.`);
      setResponseDate(new Date());
      setStatus(`${response}ed`);
    } catch (error) {
      toast.error(error.message);
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
        <InvitationDeleteButton
          id={id}
          deleteHandler={deleteHandler}
        ></InvitationDeleteButton>
      </div>
    );
  }

  if (new Date() > expiresDate) {
    return (
      <div
        className={
          readAt
            ? "flex border rounded-sm p-1 m-1"
            : "flex border-2 rounded-sm p-1 m-1"
        }
      >
        <p>
          {invitedBy} asked you to join Group {groupName} on{" "}
          {createdDate.toDateString()}. Invitation expired on{" "}
          {expiresDate.toDateString()}.
        </p>
        <InvitationDeleteButton
          id={id}
          deleteHandler={deleteHandler}
        ></InvitationDeleteButton>
      </div>
    );
  }

  return (
    <div
      className={
        readAt
          ? "flex border rounded-sm p-1 m-1"
          : "flex border-2 rounded-sm p-1 m-1"
      }
    >
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
