import BetInput from "./BetInput";
import { useEffect, useState, Fragment } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../api/client";

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

function BetForm({
  userId,
  bettingSessionId,
  competitionId,
  seasonId,
  matchday,
}) {
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betExists, setBetExists] = useState(false);
  const [edit, setEdit] = useState(false);
  const [bets, setBets] = useState();
  const [submitBetError, setSubmitBetError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const { token } = useAuth();
  const { apiFetch } = useApi();

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        setBetExists(false);
        setEdit(false);
        setSubmitBetError(null);
        setSubmitSuccess(null);
        const [matches, bets] = await Promise.all([
          apiFetch(
            `/matches?competitionId=${competitionId}&seasonId=${seasonId}&round=${matchday}`,
          ),
          apiFetch(
            `/bets?userId=${userId}&bettingSessionId=${bettingSessionId}&round=${matchday}`,
          ),
        ]);
        matches.sort((a, b) => {
          if (a.kickoff_at < b.kickoff_at) {
            return -1;
          } else if (a.kickoff_at > b.kickoff_at) {
            return 1;
          } else {
            return 0;
          }
        });
        setMatches(matches);
        if (bets.length > 0) {
          setBets(bets);
          setBetExists(true);
        } else {
          setBets(
            matches.map((match) => {
              return { match_id: match.id, home_goals: 0, away_goals: 0 };
            }),
          );
          setEdit(true);
        }
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (!(matchday && bettingSessionId)) {
      return;
    } else {
      fetchMatches();
    }
  }, [matchday, competitionId, seasonId, bettingSessionId, userId]);

  function handleBetChange(event, id) {
    const updatedBets = bets.map((bet) => {
      if (bet.match_id === id) {
        if (event.target.getAttribute("name") === "home") {
          return {
            ...bet,
            home_goals:
              event.target.value === "" ? "" : Number(event.target.value),
          };
        } else {
          return {
            ...bet,
            away_goals:
              event.target.value === "" ? "" : Number(event.target.value),
          };
        }
      } else {
        return bet;
      }
    });
    setBets(updatedBets);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const body = { userId: userId, bettingSessionId: bettingSessionId, bets };
    try {
      await apiFetch("/bets", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setSubmitBetError(null);
      setEdit(false);
      setSubmitSuccess("Bet sent.");
      setBetExists(true);
    } catch (error) {
      setSubmitBetError(error.message);
    }
  }

  if (!matchday) {
    return <p>Please select a matchday to view matches.</p>;
  }

  if (!bettingSessionId) {
    return <p>Please select a betting session to view matches.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch matches.</p>;
  }

  if (!matches || matches.length === 0) {
    return <p>No matches found for matchday {matchday}.</p>;
  }

  const betInputs = matches.map((match) => {
    let lastKickoff;
    const showHeader = match.kickoff_at !== lastKickoff;
    lastKickoff = match.kickoff_at;
    const bet = bets.find((bet) => {
      return bet.match_id === match.id;
    });
    return (
      <Fragment key={match.id}>
        {showHeader && <p>{formatKickoff(new Date(lastKickoff))}</p>}
        <BetInput
          match={match}
          bet={bet}
          handleChange={handleBetChange}
          isDisabled={edit ? false : true}
        ></BetInput>
      </Fragment>
    );
  });

  if (!betExists) {
    return (
      <div className="bet-form">
        <form className="bet-form" onSubmit={handleSubmit}>
          {betInputs}
          <button type="submit">Submit bet</button>
        </form>
        {submitBetError ? (
          <p className="error">Submit bet failed due to: {submitBetError}</p>
        ) : undefined}
      </div>
    );
  } else {
    if (!edit) {
      return (
        <div className="bet-form">
          <form className="bet-form">{betInputs}</form>
          <button
            type="button"
            onClick={(event) => {
              setEdit(true);
            }}
          >
            Edit
          </button>
          {submitSuccess ? (
            <p className="text-green-800">{submitSuccess}</p>
          ) : undefined}
        </div>
      );
    } else {
      return (
        <div className="bet-form">
          <form className="bet-form" onSubmit={handleSubmit}>
            {betInputs}
            <button type="submit">Update bet</button>
          </form>
          <button
            type="button"
            onClick={() => {
              setEdit(false);
            }}
          >
            Cancel
          </button>
          {submitBetError ? (
            <p className="error">Update bet failed due to: {submitBetError}</p>
          ) : undefined}
        </div>
      );
    }
  }
}

export default BetForm;
