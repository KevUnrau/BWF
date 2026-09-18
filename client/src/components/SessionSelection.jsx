import { useNavigate } from "react-router";
import { useFetchData } from "../hooks/useFetchData";

function SessionSelection({ selectedGroup, selectedSession }) {
  const navigate = useNavigate();
  const {
    data: sessions,
    error,
    loading,
  } = useFetchData(selectedGroup ? `/groups/${selectedGroup}/sessions` : null);

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
        onChange={(event) => {
          const sessionId = event.target.value;
          if (sessionId) {
            navigate(`/group/${selectedGroup}/session/${sessionId}`);
          } else {
            navigate(`/group/${selectedGroup}`);
          }
        }}
        value={selectedSession ? selectedSession : ""}
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
