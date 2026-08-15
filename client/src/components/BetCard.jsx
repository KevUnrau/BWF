function BetCard({ match, bet }) {
  return (
    <>
      <div className="bet-card">
        <div>
          {match.clubs_matches_home_idToclubs.name} {match.home_goals} :{" "}
          {match.away_goals} {match.clubs_matches_away_idToclubs.name}
        </div>
        <div>
          Your bet: {bet.home_goals} : {bet.away_goals}
        </div>
        <div>Your points: {bet.points}</div>
      </div>
    </>
  );
}

export default BetCard;
