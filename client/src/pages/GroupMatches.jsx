import { useState } from "react";
import { useParams } from "react-router";
import BetMatchdaySelection from "../components/BetMatchdaySelection";
import BetMatchdayForm from "../components/BetMatchdayForm";
import BetCardList from "../components/BetCardList";

function GroupMatches() {
  const { sessionId } = useParams();

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
          ></BetMatchdaySelection>
        </div>
        <BetMatchdayForm
          session={sessionId}
          matchday={selectedBetMatchday}
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
          ></BetMatchdaySelection>
        </div>
        <BetCardList
          matchday={selectedPreviousMatchday}
          bettingSessionId={sessionId}
        ></BetCardList>
      </section>
    </>
  );
}

export default GroupMatches;
