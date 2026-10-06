function MatchdaySelection({
  matchdays,
  loading,
  error,
  changeHandler,
  selectedMatchday,
}) {
  if (loading) {
    return <p>loading...</p>;
  }
  if (error) {
    return <p className="error">Failed to fetch matchdays.</p>;
  }
  if (!matchdays || matchdays.lenngth === 0) {
    return <p>No matchdays found.</p>;
  }

  const sortedMatchdays = matchdays.sort((a, b) => {
    if (a.round > b.round) {
      return 1;
    } else {
      return -1;
    }
  });

  const options = sortedMatchdays.map((matchday) => {
    return (
      <option value={matchday.round} key={`matchday-${matchday.round}`}>
        {matchday.round}
      </option>
    );
  });
  return (
    <>
      <label htmlFor="matchday-selection">Matchday:</label>
      <select
        id="matchday-selection"
        value={selectedMatchday.round}
        onChange={(event) => {
          if (event.target.value) {
            changeHandler(
              matchdays.find((matchday) => {
                return matchday.round === event.target.value;
              }),
            );
          } else {
            changeHandler("");
          }
        }}
      >
        <option key="matchday-null" value={""}>
          --Matchday--
        </option>
        {options}
      </select>
    </>
  );
}

export default MatchdaySelection;
