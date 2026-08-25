import { useEffect, useState } from "react";
import GroupTableRow from "./GroupTableRow";
import { useFetchData } from "../hooks/useFetchData";

function GroupTable({ bettingSessionId }) {
  const {
    data: standings,
    loading,
    error,
  } = useFetchData(
    bettingSessionId
      ? `/bets/standings?bettingSessionId=${bettingSessionId}`
      : null,
  );

  if (!bettingSessionId) {
    return <p>Please select a betting session to view standings.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch standings.</p>;
  }

  if (!standings || standings.length === 0) {
    return <p>No standings available.</p>;
  }

  const tableRows = standings
    .sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        return 0;
      }
    })
    .map((standing, index) => {
      return (
        <GroupTableRow
          standing={standing}
          key={standing.users.username}
          position={index + 1}
        ></GroupTableRow>
      );
    });

  return (
    <table className="table-fixed border-collapse">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Username</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
}

export default GroupTable;
