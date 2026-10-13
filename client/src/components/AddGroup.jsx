import { useState } from "react";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router";

function AddGroup() {
  const [group, setGroup] = useState("");
  const { apiFetch } = useApi();
  const navigate = useNavigate();
  const { toast } = useToast();
  async function handleSubmit(groupName) {
    try {
      const body = { groupName };
      const group = await apiFetch(`/groups`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      navigate(`/group/${group.id}/settings`);
    } catch (error) {
      toast.error(error.message);
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
