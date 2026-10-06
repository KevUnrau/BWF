import MatchdayForm, { transformMatchObject } from "./MatchdayForm";
import { useEffect, useState } from "react";
import { useApi } from "../api/client";

function BetMatchdayForm({ matchday, session }) {
  const [matches, setMatches] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { apiFetch } = useApi();

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const [matches, bets] = await Promise.all([
          apiFetch(`/sessions/${session}/matches?round=${matchday.round}`),
          apiFetch(`/sessions/${session}/bets?&round=${matchday.round}`),
        ]);
        if (bets.length > 0) {
          setMatches(
            matches.map((match) => {
              const homeGoals = bets.find((bet) => {
                return bet.match_id === match.id;
              }).home_goals;
              const awayGoals = bets.find((bet) => {
                return bet.match_id === match.id;
              }).away_goals;
              return { ...match, home_goals: homeGoals, away_goals: awayGoals };
            }),
          );
        } else {
          setMatches(
            matches.map((match) => {
              return { ...match, home_goals: null, away_goals: null };
            }),
          );
        }
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (!(matchday && session)) {
      return;
    }
    fetchMatches();
  }, [matchday, session]);

  async function handleSubmit(event, matchResults) {
    event.preventDefault();
    const bets = transformMatchObject(matchResults);
    const body = { session: Number(session), bets };
    try {
      await apiFetch("/bets", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (!session) {
    return <p>Please select a session to view matches.</p>;
  }

  if (!matchday) {
    return <p>Please select a matchday to view matches.</p>;
  }
  return (
    <MatchdayForm
      matches={matches}
      loading={loading}
      error={error}
      submitHandler={handleSubmit}
    ></MatchdayForm>
  );
}

export default BetMatchdayForm;
