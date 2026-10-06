import CompetitionSelection from "../components/CompetitionSelection";
import SeasonSelection from "../components/SeasonSelection";
import AdminMatchdaySelection from "../components/AdminMatchdaySelection";
import AdminMatchdayForm from "../components/AdminMatchdayForm";
import { useState } from "react";

function Admin() {
  const [competition, setCompetition] = useState("");
  const [season, setSeason] = useState("");
  const [matchday, setMatchday] = useState("");

  function handleCompetitionSelection(competition) {
    setMatchday("");
    setSeason("");
    setCompetition(competition);
  }

  function handleSeasonSelection(season) {
    setMatchday("");
    setSeason(season);
  }

  function handleMatchdaySelection(matchday) {
    setMatchday(matchday);
  }

  return (
    <>
      <CompetitionSelection
        selectedCompetition={competition}
        changeHandler={handleCompetitionSelection}
      ></CompetitionSelection>
      <SeasonSelection
        selectedCompetition={competition}
        selectedSeason={season}
        changeHandler={handleSeasonSelection}
      ></SeasonSelection>
      <AdminMatchdaySelection
        competition={competition}
        season={season}
        selectedMatchday={matchday}
        changeHandler={handleMatchdaySelection}
      ></AdminMatchdaySelection>
      <AdminMatchdayForm
        competition={competition}
        season={season}
        matchday={matchday}
      ></AdminMatchdayForm>
    </>
  );
}

export default Admin;
