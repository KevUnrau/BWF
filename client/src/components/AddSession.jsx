import { useState } from "react";
import CompetitionSelection from "./CompetitionSelection";
import SeasonSelection from "./SeasonSelection";
import { useApi } from "../api/client";

function AddSession({ groupId }) {
  const [name, setName] = useState("");
  const [competition, setCompetition] = useState("");
  const [season, setSeason] = useState("");
  const [notion, setNotion] = useState("");
  const { apiFetch } = useApi();

  function handleCompetitionSelection(competition) {
    setSeason("");
    setCompetition(competition);
  }

  function handleSeasonSelection(season) {
    setSeason(season);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotion("");
    if (!name) {
      setNotion("Please choose a session name.");
      return;
    }
    if (!competition) {
      setNotion("Please select a competition.");
      return;
    }
    if (!season) {
      setNotion("Please select a season.");
      return;
    }
    const body = {
      groupId,
      competition: Number(competition),
      season: Number(season),
      name,
    };
    await apiFetch("/sessions", { method: "POST", body: JSON.stringify(body) });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        ></input>
        <CompetitionSelection
          changeHandler={handleCompetitionSelection}
          selectedCompetition={competition}
        ></CompetitionSelection>
        <SeasonSelection
          changeHandler={handleSeasonSelection}
          selectedCompetition={competition}
          selectedSeason={season}
        ></SeasonSelection>
        <button type="submit">Create</button>
      </form>
      {notion ? <p className="error">{notion}</p> : null}
    </>
  );
}

export default AddSession;
