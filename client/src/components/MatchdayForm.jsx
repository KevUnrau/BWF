import MatchInput from "./MatchInput";
import { useState, useEffect, Fragment } from "react";

function formatKickoff(timestamp) {
  const date = new Date(timestamp);

  return (
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) +
    " • " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
}

export function transformMatchObject(results) {
  const matchesId = Object.keys(results);
  const matchesGoals = Object.values(results);
  return matchesId.map((id, index) => {
    return { id: Number(id), ...matchesGoals[index] };
  });
}

function MatchdayForm({ matches, error, loading, submitHandler }) {
  const [matchResults, setMatchResults] = useState("");

  useEffect(() => {
    if (!matches) {
      return;
    }
    setMatchResults(
      Object.fromEntries(
        matches.map((match) => {
          return [
            match.id,
            {
              homeGoals: match.home_goals ?? "",
              awayGoals: match.away_goals ?? "",
            },
          ];
        }),
      ),
    );
  }, [matches]);

  function handleResultChange(matchId, result) {
    setMatchResults((prev) => {
      return { ...prev, [matchId]: result };
    });
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch matches.</p>;
  }

  if (!matches || matches.length === 0) {
    return <p>No matches found.</p>;
  }

  const sortedMatches = matches.sort((a, b) => {
    if (a.kickoff_at < b.kickoff_at) {
      return -1;
    }
    return 1;
  });

  let kickoff;
  const matchInputs = sortedMatches.map((match) => {
    const showHeader = kickoff !== match.kickoff_at;
    kickoff = match.kickoff_at;
    return (
      <Fragment key={`match-${match.id}`}>
        {showHeader && <p>{formatKickoff(new Date(kickoff))}</p>}
        <MatchInput
          match={match}
          result={
            matchResults[match.id] ?? {
              homeGoals: match.home_goals ?? "",
              awayGoals: match.away_goals ?? "",
            }
          }
          changeHandler={handleResultChange}
        ></MatchInput>
      </Fragment>
    );
  });

  return (
    <form
      className="bet-form"
      onSubmit={(event) => {
        submitHandler(event, matchResults);
      }}
    >
      {matchInputs}
      <button type="submit">Submit</button>
    </form>
  );
}

export default MatchdayForm;
