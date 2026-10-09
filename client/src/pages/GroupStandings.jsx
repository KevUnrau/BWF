import GroupTable from "../components/GroupTable";
import { useParams } from "react-router";

function GroupStandings() {
  const { groupId, sessionId } = useParams();
  return (
    <>
      <h2>Standings</h2>
      <GroupTable sessionId={sessionId} groupId={groupId}></GroupTable>
    </>
  );
}

export default GroupStandings;
