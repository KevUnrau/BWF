import MatchInput from "./MatchInput";
import Button from "./Button";
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

function MatchdayForm({
  matches,
  error,
  loading,
  submitHandler,
  isSubmitting,
}) {
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
    return a.kickoff_at - b.kickoff_at;
  });

  let kickoff;
  const matchInputs = sortedMatches.map((match) => {
    const showHeader = kickoff !== match.kickoff_at;
    kickoff = match.kickoff_at;
    return (
      <Fragment key={`match-${match.id}`}>
        {showHeader && (
          <p className="font-bold">{formatKickoff(new Date(kickoff))}</p>
        )}
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
      className="flex flex-col items-center"
      onSubmit={(event) => {
        submitHandler(event, matchResults);
      }}
    >
      {matchInputs}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

export default MatchdayForm;
