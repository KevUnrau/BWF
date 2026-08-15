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
  const { token } = useAuth();
  const { apiFetch } = useApi();

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        setBetExists(false);
        setEdit(false);
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
    if (matchday == null) {
      return;
    } else {
      fetchMatches();
    }
  }, [matchday]);

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

  function handleSubmit(event) {
    event.preventDefault();
    const body = { userId: userId, bettingSessionId: bettingSessionId, bets };
    apiFetch("/bets", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  let betInputs;
  if (!loading) {
    let lastKickoff;
    betInputs = matches.map((match) => {
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
  }

  let content;
  if (loading) {
    content = <p>loading...</p>;
  } else if (error) {
    content = <p className="error">Failed to fetch matches.</p>;
  } else {
    if (!betExists) {
      content = (
        <form className="bet-form" onSubmit={handleSubmit}>
          {betInputs}
          <button type="submit">Submit bet</button>
        </form>
      );
    } else {
      if (!edit) {
        content = (
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
          </div>
        );
      } else {
        content = (
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
          </div>
        );
      }
    }
  }

  return content;
}

export default BetForm;
