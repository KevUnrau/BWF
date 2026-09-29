import { useState } from "react";
import { useApi } from "../api/client";
import { useNavigate } from "react-router";

function AddGroup() {
  const [group, setGroup] = useState("");
  const { apiFetch } = useApi();
  const navigate = useNavigate();
  async function handleSubmit(groupName) {
    try {
      const body = { groupName };
      const group = await apiFetch(`/groups`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      navigate(`/group/${group.id}/settings`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <label htmlFor="addGroup">Create group: </label>
      <input
        type="text"
        id="addGroup"
        onChange={(event) => {
          setGroup(event.target.value);
        }}
        value={group}
        min={4}
        max={50}
      ></input>
      <button
        onClick={() => {
          handleSubmit(group);
        }}
      >
        Create
      </button>
    </>
  );
}

export default AddGroup;
