import { useState } from "react";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function RemoveSession({ groupId }) {
  const [session, setSession] = useState("");
  const { apiFetch } = useApi();
  const { toast } = useToast();
  async function handleSubmit(session) {
    try {
      await apiFetch(`/sessions?groupId=${groupId}&session=${session}`, {
        method: "DELETE",
      });
      toast.success(`${session} deleted.`);
      setSession("");
    } catch (error) {
      toast.error(error.message);
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
