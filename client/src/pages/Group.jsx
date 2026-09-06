import GroupTable from "../components/GroupTable";
import BetForm from "../components/BetForm";
import BetCardList from "../components/BetCardList";
import GroupSelection from "../components/GroupSelection.jsx";
import SessionSelection from "../components/SessionSelection.jsx";
import MatchdaySelection from "../components/MatchdaySelection.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFetchData } from "../hooks/useFetchData.js";

const matchdayFilter = {
  open: (matchday) => {
    return matchday.status_id === 3 || matchday.status_id === 1;
  },
  previous: (matchday) => {
    return matchday.status_id === 2;
  },
};

function Group() {
  const { user } = useAuth();

  const [selectedPreviousMatchday, setSelectedPreviousMatchday] = useState("");
  const [selectedBetMatchday, setSelectedBetMatchday] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBettingSession, setSelectedBettingSession] = useState("");

  if (!user) {
    return <p>Please sign in to view your groups.</p>;
  }

  function handleGroupSelection(group) {
    setSelectedBettingSession("");
    setSelectedGroup(group);
  }

  function handleSessionSelection(session) {
    setSelectedBettingSession(session);
  }

  function handleMatchdaySelection(matchday) {
    setSelectedBetMatchday(matchday);
  }

  function handlePreviousMatchdaySelection(matchday) {
    setSelectedPreviousMatchday(matchday);
  }

  return (
    <>
      <section id="groups">
        <h2>Groups</h2>
        <div>
          <GroupSelection
            changeHandler={handleGroupSelection}
            selectedGroup={selectedGroup}
          ></GroupSelection>
        </div>
        <div>
          <SessionSelection
            changeHandler={handleSessionSelection}
            selectedGroup={selectedGroup}
            selectedSession={selectedBettingSession.id}
          ></SessionSelection>
        </div>
      </section>
      <hr></hr>
      <>
        <section id="group-standings">
          <h2>Standings</h2>
          <GroupTable bettingSessionId={selectedBettingSession.id}></GroupTable>
        </section>
        <hr></hr>
        <section id="bet-form">
          <h2>Bet</h2>
          <div>
            <MatchdaySelection
              session={selectedBettingSession}
              status="open"
              selectedMatchday={selectedBetMatchday}
              changeHandler={handleMatchdaySelection}
              initValue="min"
            ></MatchdaySelection>
          </div>
          <BetForm
            matchday={selectedBetMatchday}
            seasonId={selectedBettingSession.season_id}
            competitionId={selectedBettingSession.competition_id}
            userId={user.id}
            bettingSessionId={selectedBettingSession.id}
          ></BetForm>
        </section>
        <hr></hr>
        <section id="previous-bet">
          <h2>Prediction results</h2>
          <div>
            <MatchdaySelection
              session={selectedBettingSession}
              status="closed"
              selectedMatchday={selectedPreviousMatchday}
              changeHandler={handlePreviousMatchdaySelection}
              initValue="max"
            ></MatchdaySelection>
          </div>
          <BetCardList
            matchday={selectedPreviousMatchday}
            bettingSessionId={selectedBettingSession.season_id}
            userId={user.id}
          ></BetCardList>
        </section>
      </>
    </>
  );
}

export default Group;
