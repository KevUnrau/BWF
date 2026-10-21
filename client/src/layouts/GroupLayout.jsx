import { Outlet, useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import GroupSelection from "../components/GroupSelection.jsx";
import SessionSelection from "../components/SessionSelection.jsx";
import { Settings, SquarePlus } from "lucide-react";

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
          {groupId ? (
            <Link className="surface-link" to={`/group/${groupId}/settings`}>
              <Settings size={30} className="inline"></Settings>
            </Link>
          ) : (
            <Link className="surface-link" to={"create"}>
              <SquarePlus size={30} className="inline"></SquarePlus>
            </Link>
          )}
        </h2>
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
