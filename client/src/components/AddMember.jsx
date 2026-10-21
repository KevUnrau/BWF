import Button from "./Button";
import { useState } from "react";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function AddMember({ groupId }) {
  const [member, setMember] = useState("");
  const { apiFetch } = useApi();
  const { toast } = useToast();
  async function handleSubmit(username) {
    try {
      const body = { invited: username, groupId };
      await apiFetch(`/invitations`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast.success(`${member} invited.`);
      setMember("");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="single-input">
      <label htmlFor="addMember">Invite member to group: </label>
      <input
        type="text"
        id="addMember"
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
      >
        Invite
      </Button>
    </div>
  );
}

export default AddMember;
