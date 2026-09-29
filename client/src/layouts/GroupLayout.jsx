import { Outlet, useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import GroupSelection from "../components/GroupSelection.jsx";
import SessionSelection from "../components/SessionSelection.jsx";

function GroupLayout() {
  const { user } = useAuth();
  const { groupId, sessionId } = useParams();

  if (!user) {
    return <p>Please sign in to view your groups.</p>;
  }

  return (
    <>
      <section id="groups">
        <h2>
          Groups{" "}
          {groupId ? <Link to={`/group/${groupId}/settings`}>⚙️</Link> : null}
        </h2>
        <div>
          <GroupSelection selectedGroup={groupId}></GroupSelection>{" "}
          {!groupId ? (
            <>
              Create a new group <Link to={"create"}>➕</Link>{" "}
            </>
          ) : null}
          .
        </div>
        <div>
          <SessionSelection
            selectedGroup={groupId}
            selectedSession={sessionId}
          ></SessionSelection>
        </div>
      </section>
      <Outlet></Outlet>
    </>
  );
}

export default GroupLayout;
