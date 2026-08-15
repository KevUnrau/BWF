import { useEffect, useState } from "react";
import GroupTableRow from "./GroupTableRow";
import { useApi } from "../api/client";

function GroupTable({ bettingSessionId }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiFetch } = useApi();

  useEffect(() => {
    async function fetchMatches() {
      try {
        const standings = await apiFetch(
          `/bets/standings?bettingSessionId=${bettingSessionId}`,
        );
        setStandings(
          standings.sort((a, b) => {
            if (a.points > b.points) {
              return -1;
            } else if (a.points < b.points) {
              return 1;
            } else {
              return 0;
            }
          }),
        );
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (bettingSessionId) {
      fetchMatches();
    }
  }, [bettingSessionId]);

  let tableRows;
  if (!loading) {
    tableRows = standings.map((standing, index) => {
      return (
        <GroupTableRow
          standing={standing}
          key={standing.users.username}
          position={index + 1}
        ></GroupTableRow>
      );
    });
  }

  if (loading) {
    return <p>loading...</p>;
  } else if (error) {
    return <p className="error">Failed to fetch standings.</p>;
  } else {
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
}

export default GroupTable;
