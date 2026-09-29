import { useState } from "react";
import { useApi } from "../api/client";

function RemoveSession({ groupId }) {
  const [session, setSession] = useState("");
  const { apiFetch } = useApi();
  async function handleSubmit(session) {
    try {
      await apiFetch(`/sessions?groupId=${groupId}&session=${session}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <label htmlFor="removeSession">Delete session: </label>
      <input
        type="text"
        id="removeSession"
        onChange={(event) => {
          setSession(event.target.value);
        }}
        value={session}
        min={2}
        max={30}
      ></input>
      <button
        onClick={() => {
          handleSubmit(session);
        }}
      >
        Delete
      </button>
    </>
  );
}

export default RemoveSession;
