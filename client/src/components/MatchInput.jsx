function MatchInput({ match, changeHandler, result }) {
  return (
    <div className="grid grid-cols-[1fr_60px_20px_60px_1fr] items-center gap-0.5 mb-1">
      <label htmlFor={`home-${match.id}`} className="text-right">
        {match.clubs_matches_home_idToclubs.name}
        <img
          className="club-icon"
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
        placeholder="/"
      ></input>
      <span className="text-center">:</span>
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
        placeholder="/"
      ></input>
      <label htmlFor={`away-${match.id}`} className="text-left">
        <img
          className="club-icon"
          src={match.clubs_matches_away_idToclubs.logo_filename}
          alt={match.clubs_matches_away_idToclubs.name}
        ></img>
        {match.clubs_matches_away_idToclubs.name}
      </label>
    </div>
  );
}

export default MatchInput;
