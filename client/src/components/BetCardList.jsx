import { useEffect, useState } from "react";
import BetCard from "./BetCard";
import { useApi } from "../api/client.js";

function BetCardList({ matchday, userId, bettingSessionId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bets, setBets] = useState([]);
  const { apiFetch } = useApi();

  useEffect(() => {
    async function fetchBets() {
      try {
        setLoading(true);
        const bets = await apiFetch(
          `/bets?userId=${userId}&bettingSessionId=${bettingSessionId}&round=${matchday}&include=matches`,
        );
        setBets(bets);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBets();
  }, [matchday]);

  let content;
  if (loading) {
    content = <p>loading...</p>;
  } else if (error) {
    content = <p className="error">Failed to fetch bets.</p>;
  } else {
    if (bets.length === 0) {
      content = <p>No bets found for matchday {matchday}.</p>;
    } else {
      const totalPoints = bets.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.points;
      }, 0);

      const betCards = bets.map((bet) => {
        return (
          <li key={bet.match_id}>
            <BetCard match={bet.matches} bet={bet}></BetCard>
          </li>
        );
      });
      content = (
        <>
          <ul>{betCards}</ul>
          <div className="bet-card">
            Total Points for matchday {matchday}: {totalPoints}
          </div>
        </>
      );
    }
  }

  return content;
}

export default BetCardList;
