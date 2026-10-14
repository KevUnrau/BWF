function BetCard({ match, bet }) {
  return (
    <>
      <div className="bet-card">
        <div>
          {match.clubs_matches_home_idToclubs.name}
          <img
            className="h-8 w-8 inline mlr-1"
            src={match.clubs_matches_home_idToclubs.logo_filename}
            alt={match.clubs_matches_home_idToclubs.name}
          ></img>
          {match.home_goals} : {match.away_goals}
          <img
            className="h-8 w-8 inline mlr-1"
            src={match.clubs_matches_away_idToclubs.logo_filename}
            alt={match.clubs_matches_away_idToclubs.name}
          ></img>
          {match.clubs_matches_away_idToclubs.name}
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
