import { useFetchData } from "../hooks/useFetchData";
import { useApi } from "../api/client";
import MatchdayForm, { transformMatchObject } from "./MatchdayForm";

function AdminMatchdayForm({ competition, season, matchday }) {
  const {
    data: matches,
    loading,
    error,
  } = useFetchData(
    competition && season && matchday
      ? `/competitions/${competition}/season/${season}/matches?matchday=${matchday.round}`
      : null,
  );

  const { apiFetch } = useApi();

  async function handleSubmit(event, matchResults) {
    event.preventDefault();
    const matches = transformMatchObject(matchResults);
    const body = {
      competition: Number(competition),
      season: Number(season),
      matchday,
      matches,
    };

    try {
      if (matchday.match_status.name === "in progress") {
        await apiFetch("/matchdays/close", {
          method: "POST",
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch("/matchdays/recalculate", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!competition || !season) {
    return;
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

export default AdminMatchdayForm;
