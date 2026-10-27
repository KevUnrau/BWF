import { useFetchData } from "../hooks/useFetchData";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
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
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event, matchResults) {
    event.preventDefault();
    setIsSubmitting(true);
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
        toast.success("Matchday closed.");
      } else if (matchday.match_status.name === "closed") {
        await apiFetch("/matchdays/recalculate", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Matchday recalculated.");
      } else {
        throw new Error("You can't close a matchday that is not in progress.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
      isSubmitting={isSubmitting}
    ></MatchdayForm>
  );
}

export default AdminMatchdayForm;
