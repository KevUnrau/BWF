import { useState } from "react";
import { useParams } from "react-router";
import BetMatchdaySelection from "../components/BetMatchdaySelection";
import BetMatchdayForm from "../components/BetMatchdayForm";
import BetCardList from "../components/BetCardList";

function GroupMatches() {
  const { groupId, sessionId } = useParams();

  const [selectedPreviousMatchday, setSelectedPreviousMatchday] = useState("");
  const [selectedBetMatchday, setSelectedBetMatchday] = useState("");

  function handleMatchdaySelection(matchday) {
    setSelectedBetMatchday(matchday);
  }

  function handlePreviousMatchdaySelection(matchday) {
    setSelectedPreviousMatchday(matchday);
  }
  return (
    <>
      <section id="bet-form">
        <h2>Bet</h2>
        <div>
          <BetMatchdaySelection
            session={sessionId}
            status="open"
            selectedMatchday={selectedBetMatchday}
            changeHandler={handleMatchdaySelection}
            initValue="min"
            group={groupId}
          ></BetMatchdaySelection>
        </div>
        <BetMatchdayForm
          session={sessionId}
          matchday={selectedBetMatchday}
          group={groupId}
        ></BetMatchdayForm>
      </section>
      <hr></hr>
      <section id="previous-bet">
        <h2>Prediction results</h2>
        <div>
          <BetMatchdaySelection
            session={sessionId}
            status="closed"
            selectedMatchday={selectedPreviousMatchday}
            changeHandler={handlePreviousMatchdaySelection}
            initValue="max"
            group={groupId}
          ></BetMatchdaySelection>
        </div>
        <BetCardList
          groupId={groupId}
          matchday={selectedPreviousMatchday}
          bettingSessionId={sessionId}
        ></BetCardList>
      </section>
    </>
  );
}

export default GroupMatches;
