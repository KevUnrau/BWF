function BetInput({ match, bet, handleChange, isDisabled }) {
  return (
    <div className="bet-input">
      <label className="home" htmlFor={"home" + match.id}>
        {match.clubs_matches_home_idToclubs.name}
      </label>
      <input
        name="home"
        id={"home" + match.id}
        type="number"
        min={0}
        disabled={isDisabled}
        value={bet.home_goals}
        onChange={(event) => {
          handleChange(event, match.id);
        }}
      ></input>
      <span className="colon">:</span>
      <input
        className="away"
        name="away"
        id={"away" + match.id}
        type="number"
        min={0}
        disabled={isDisabled}
        value={bet.away_goals}
        onChange={(event) => {
          handleChange(event, match.id);
        }}
      ></input>
      <label htmlFor={"away" + match.id}>
        {match.clubs_matches_away_idToclubs.name}
      </label>
    </div>
  );
}

export default BetInput;
