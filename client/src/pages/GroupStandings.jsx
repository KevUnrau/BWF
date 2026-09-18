import GroupTable from "../components/GroupTable";
import { useParams } from "react-router";

function GroupStandings() {
  const { sessionId } = useParams();
  return (
    <>
      <h2>Standings</h2>
      <GroupTable sessionId={sessionId}></GroupTable>
    </>
  );
}

export default GroupStandings;
