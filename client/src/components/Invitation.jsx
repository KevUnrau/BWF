import { useApi } from "../api/client";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import InvitationDeleteButton from "./InvitationDeleteButton";
import Button from "./Button";
import { X, Check } from "lucide-react";

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
      setResponseDate(new Date());
      setStatus(response);
      toast.success(`You ${response}.`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const createdDate = new Date(invitationCreated);
  const expiresDate = new Date(invitationExpires);

  if (status !== "open") {
    return (
      <div className="card">
        <div className="flex">
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
      </div>
    );
  }

  if (new Date() > expiresDate) {
    return (
      <div className="card">
        <div className={readAt ? "" : "font-bold"}>
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
      </div>
    );
  }

  return (
    <div className="card">
      <div className={readAt ? "flex" : "flex font-bold"}>
        <p>
          {invitedBy} asked you to join Group {groupName} on{" "}
          {createdDate.toDateString()}. Invitation expires on{" "}
          {expiresDate.toDateString()}.
        </p>
        <Button
          variant="icon"
          className="ml-auto"
          onClick={() => {
            handleInvitationResponse("accepted");
          }}
        >
          <Check color="green"></Check>
        </Button>
        <Button
          variant="icon"
          onClick={() => {
            handleInvitationResponse("declined");
          }}
        >
          <X color="red"></X>
        </Button>
      </div>
    </div>
  );
}

export default Invitation;
