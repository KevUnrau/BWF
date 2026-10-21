function BetCard({ match, bet }) {
  return (
    <>
      <div className="card">
        <div>
          {match.clubs_matches_home_idToclubs.name}
          <img
            className="club-icon"
            src={match.clubs_matches_home_idToclubs.logo_filename}
            alt={match.clubs_matches_home_idToclubs.name}
          ></img>
          {match.home_goals} : {match.away_goals}
          <img
            className="club-icon"
            src={match.clubs_matches_away_idToclubs.logo_filename}
            alt={match.clubs_matches_away_idToclubs.name}
          ></img>
          {match.clubs_matches_away_idToclubs.name}
        </div>
        <div>
          Bet: {bet.home_goals} : {bet.away_goals}
        </div>
        <div>Points: {bet.points}</div>
      </div>
    </>
  );
}

export default BetCard;
