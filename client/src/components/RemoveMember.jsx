import Button from "./Button";
import { useState } from "react";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function RemoveMember({ groupId }) {
  const [member, setMember] = useState("");
  const { apiFetch } = useApi();
  const { toast } = useToast();
  async function handleSubmit(username) {
    try {
      await apiFetch(`/groups/${groupId}/members?member=${username}`, {
        method: "DELETE",
      });
      toast.success(`${username} removed.`);
      setMember("");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="single-input">
      <label htmlFor="removeMember">Remove member from group: </label>
      <input
        type="text"
        id="removeMember"
        onChange={(event) => {
          setMember(event.target.value);
        }}
        value={member}
        min={4}
        max={30}
        placeholder="username"
      ></input>
      <Button
        onClick={() => {
          handleSubmit(member);
        }}
        variant="danger"
      >
        Remove
      </Button>
    </div>
  );
}

export default RemoveMember;
