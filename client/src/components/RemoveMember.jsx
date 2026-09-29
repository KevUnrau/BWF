import { useState } from "react";
import { useApi } from "../api/client";

function RemoveMember({ groupId }) {
  const [member, setMember] = useState("");
  const { apiFetch } = useApi();
  async function handleSubmit(username) {
    try {
      await apiFetch(`/groups/${groupId}/members?member=${username}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
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
      ></input>
      <button
        onClick={() => {
          handleSubmit(member);
        }}
      >
        Remove
      </button>
    </>
  );
}

export default RemoveMember;
