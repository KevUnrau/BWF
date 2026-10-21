import { useState } from "react";
import CompetitionSelection from "./CompetitionSelection";
import SeasonSelection from "./SeasonSelection";
import Button from "./Button";
import { useApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function AddSession({ groupId }) {
  const [name, setName] = useState("");
  const [competition, setCompetition] = useState("");
  const [season, setSeason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { apiFetch } = useApi();
  const { toast } = useToast();

  function handleCompetitionSelection(competition) {
    setSeason("");
    setCompetition(competition);
  }

  function handleSeasonSelection(season) {
    setSeason(season);
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      if (!name) {
        toast.error("Please choose a session name.");
        return;
      }
      if (!competition) {
        toast.error("Please select a competition.");
        return;
      }
      if (!season) {
        toast.error("Please select a season.");
        return;
      }

      const body = {
        groupId,
        competition: Number(competition),
        season: Number(season),
        name,
      };
      await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast.success("Session created.");
      setName("");
      setSeason("");
      setCompetition("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="session-name">Session name:</label>
        <input
          id="session-name"
          type="text"
          min={2}
          max={30}
          required
          onChange={(event) => {
            setName(event.target.value);
          }}
          value={name}
          placeholder="session name"
        ></input>
      </div>
      <div>
        <CompetitionSelection
          changeHandler={handleCompetitionSelection}
          selectedCompetition={competition}
        ></CompetitionSelection>
      </div>
      <div>
        <SeasonSelection
          changeHandler={handleSeasonSelection}
          selectedCompetition={competition}
          selectedSeason={season}
        ></SeasonSelection>
      </div>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}

export default AddSession;
