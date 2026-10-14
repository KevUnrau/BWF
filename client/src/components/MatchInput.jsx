function MatchInput({ match, changeHandler, result }) {
  return (
    <div className="bet-input">
      <label htmlFor={`home-${match.id}`} className="home">
        {match.clubs_matches_home_idToclubs.name}
        <img
          className="h-8 w-8 inline ml-1"
          src={match.clubs_matches_home_idToclubs.logo_filename}
          alt={match.clubs_matches_home_idToclubs.name}
        ></img>
      </label>
      <input
        type="number"
        min={0}
        max={50}
        id={`home-${match.id}`}
        value={result.homeGoals}
        onChange={(event) => {
          changeHandler(match.id, {
            homeGoals:
              event.target.value === "" ? "" : Number(event.target.value),
            awayGoals: result.awayGoals,
          });
        }}
      ></input>
      <span className="colon">:</span>
      <input
        type="number"
        min={0}
        max={50}
        id={`away-${match.id}`}
        value={result.awayGoals}
        onChange={(event) => {
          changeHandler(match.id, {
            homeGoals: result.homeGoals,
            awayGoals:
              event.target.value === "" ? "" : Number(event.target.value),
          });
        }}
      ></input>
      <label htmlFor={`away-${match.id}`} className="away">
        <img
          className="h-8 w-8 inline mr-1"
          src={match.clubs_matches_away_idToclubs.logo_filename}
          alt={match.clubs_matches_away_idToclubs.name}
        ></img>
        {match.clubs_matches_away_idToclubs.name}
      </label>
    </div>
  );
}

export default MatchInput;
