import { useFetchData } from "../hooks/useFetchData";
import { useEffect } from "react";

function MatchdaySelection({
  session,
  status,
  changeHandler,
  selectedMatchday,
  initValue,
}) {
  const {
    data: matchdays,
    error,
    loading,
  } = useFetchData(
    session
      ? `/competitions/${session.competition_id}/seasons/${session.season_id}/matchdays?status=${status}`
      : null,
  );

  useEffect(() => {
    if (!matchdays) {
      return;
    }
    if (initValue === "min") {
      changeHandler(
        matchdays.reduce((previousValue, currentValue) => {
          if (previousValue.round < currentValue.round) {
            return previousValue;
          } else {
            return currentValue;
          }
        }, matchdays[0]).round,
      );
    } else {
      changeHandler(
        matchdays.reduce((previousValue, currentValue) => {
          if (previousValue.round > currentValue.round) {
            return previousValue;
          } else {
            return currentValue;
          }
        }, matchdays[0]).round,
      );
    }
  }, [matchdays, initValue]);

  if (!session) {
    return <p>Please select a betting session to view matchdays.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch matchdays</p>;
  }

  if (!matchdays || matchdays.length === 0) {
    return <p>No matchdays found.</p>;
  }

  const sortedMatchdays = matchdays.sort((a, b) => {
    if (a.round < b.round) {
      return -1;
    } else if (a.round > b.round) {
      return 1;
    } else {
      return 0;
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
      <label htmlFor={`select-matchday-${status}`}>
        Please select a matchday
      </label>
      <select
        id={`select-matchday-${status}`}
        value={selectedMatchday}
        onChange={(event) => {
          changeHandler(event.target.value);
        }}
      >
        {options}
      </select>
    </>
  );
}

export default MatchdaySelection;
