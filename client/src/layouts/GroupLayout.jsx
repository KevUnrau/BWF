import { Outlet, useParams } from "react-router";
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
        <h2>Groups</h2>
        <div>
          <GroupSelection selectedGroup={groupId}></GroupSelection>
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
