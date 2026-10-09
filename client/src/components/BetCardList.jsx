import BetCard from "./BetCard";
import { useFetchData } from "../hooks/useFetchData.js";

function BetCardList({ matchday, bettingSessionId, groupId }) {
  const {
    data: bets,
    loading,
    error,
  } = useFetchData(
    matchday && bettingSessionId && groupId
      ? `/bets?bettingSessionId=${bettingSessionId}&round=${matchday.round}&include=matches&groupId=${groupId}`
      : null,
  );

  if (!matchday) {
    return <p>Please select a matchday to view previous bets.</p>;
  }

  if (!bettingSessionId) {
    return <p>Please select a betting session to view previous bets.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch bets.</p>;
  }

  if (!bets || bets.length === 0) {
    return <p>No bets found for matchday {matchday.round}.</p>;
  }

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

  return (
    <>
      <ul>{betCards}</ul>
      <div className="bet-card">
        Total Points for matchday {matchday.round}: {totalPoints}
      </div>
    </>
  );
}

export default BetCardList;
