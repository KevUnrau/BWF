import { useState } from "react";
import { useApi } from "../api/client";

function AddMember({ currentUserId, groupId }) {
  const [member, setMember] = useState("");
  const { apiFetch } = useApi();
  async function handleSubmit(username) {
    try {
      const body = { invited: username, invitedBy: currentUserId, groupId };
      await apiFetch(`/groups/${groupId}/invitation`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
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
      ></input>
      <button
        onClick={() => {
          handleSubmit(member);
        }}
      >
        Invite
      </button>
    </>
  );
}

export default AddMember;
