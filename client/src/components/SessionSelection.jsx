import { useEffect, useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

function SessionSelection({ selectedGroup, changeHandler, selectedSession }) {
  const {
    data: sessions,
    error,
    loading,
  } = useFetchData(selectedGroup ? `/groups/${selectedGroup}/sessions` : null);

  useEffect(() => {
    if (selectedGroup && sessions && sessions.length === 1) {
      changeHandler(sessions[0]);
    }
  }, [selectedGroup, sessions]);

  if (!selectedGroup) {
    return <p>Please select a group to view betting sessions.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch sessions</p>;
  }

  if (!sessions || sessions.length === 0) {
    return <p>No sessions found.</p>;
  }

  const options = sessions.map((session) => {
    return (
      <option value={session.id} key={`session-${session.id}`}>
        {session.name}
      </option>
    );
  });

  return (
    <>
      <label htmlFor="select-session">Please select a session:</label>
      <select
        id="select-session"
        value={selectedSession}
        onChange={(event) => {
          changeHandler(
            event.target.value
              ? sessions.find((session) => {
                  return session.id === Number(event.target.value);
                })
              : "",
          );
        }}
      >
        <option value="" key="session-null">
          --Session--
        </option>
        {options}
      </select>
    </>
  );
}

export default SessionSelection;
