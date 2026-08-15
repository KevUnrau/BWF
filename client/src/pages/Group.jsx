import GroupTable from "../components/GroupTable";
import BetForm from "../components/BetForm";
import BetCardList from "../components/BetCardList";

import { useEffect, useState } from "react";
import { useApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

function Group() {
  const [matchdays, setMatchdays] = useState([]);
  const [previousMatchdays, setPreviousMatchdays] = useState([]);
  const [selectedPreviousMatchday, setSelectedPreviousMatchday] =
    useState(null);
  const [matchdaysLoading, setMatchdaysLoading] = useState(true);
  const [selectedBetMatchday, setSelectedBetMatchday] = useState(null);
  const [matchdaysError, setMatchdaysError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupsError, setGroupsError] = useState(null);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [bettingSessions, setBettingSessions] = useState([]);
  const [selectedBettingSession, setSelectedBettingSession] = useState("");
  const [bettingSessionsError, setBettingSessionsError] = useState(null);
  const [bettingSessionsLoading, setBettingSessionsLoading] = useState(true);
  const { apiFetch } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groups = await apiFetch(`/groups?userId=${user.id}`);
        setGroups(groups);
        if (groups.length === 1) {
          setSelectedGroup(groups[0].group_id);
        }
      } catch (error) {
        console.log(error);
        setGroupsError(error);
      } finally {
        setGroupsLoading(false);
      }
    }
    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    async function fetchBettingSessions() {
      try {
        setBettingSessionsLoading(true);
        const bettingSessions = await apiFetch(
          `/groups/${selectedGroup}/sessions`,
        );
        setBettingSessions(bettingSessions);
        if (bettingSessions.length === 1) {
          setSelectedBettingSession(bettingSessions[0]);
        }
        setBettingSessionsError(null);
      } catch (error) {
        setBettingSessionsError(error);
      } finally {
        setBettingSessionsLoading(false);
      }
    }
    if (selectedGroup) {
      fetchBettingSessions();
    }
  }, [selectedGroup]);

  //fetch all matchdays for selected competition and season
  useEffect(() => {
    async function fetchMatches() {
      try {
        const matchdays = await apiFetch(
          `/competitions/${selectedBettingSession.competition_id}/seasons/${selectedBettingSession.season_id}/matchdays`,
        );
        matchdays.sort((a, b) => {
          if (a.round < b.round) {
            return -1;
          } else if (a.round > b.round) {
            return 1;
          } else {
            return 0;
          }
        });
        const openMatchdays = matchdays.filter((matchday) => {
          return matchday.status_id === 3 || matchday.status_id === 1;
        });
        const previousMatchdays = matchdays.filter((matchday) => {
          return matchday.status_id === 2;
        });
        setMatchdays(openMatchdays);
        setPreviousMatchdays(previousMatchdays);
        setSelectedPreviousMatchday(
          previousMatchdays.reduce((accumulator, currentValue) => {
            return Math.max(accumulator, Number(currentValue.round));
          }, 0),
        );
        setSelectedBetMatchday(
          openMatchdays.find((matchday) => {
            return matchday.status_id === 3;
          })?.round,
        );
        setMatchdaysError(null);
      } catch (error) {
        setMatchdaysError(error);
      } finally {
        setMatchdaysLoading(false);
      }
    }
    if (selectedGroup && selectedBettingSession) {
      fetchMatches();
    }
  }, [selectedGroup, selectedBettingSession]);

  let matchdayContent;
  let previousMatchdayContent;
  if (matchdaysLoading) {
    matchdayContent = previousMatchdayContent = <p>loading...</p>;
  } else if (matchdaysError) {
    matchdayContent = previousMatchdayContent = (
      <p className="error">Failed to fetch matchdays.</p>
    );
  } else {
    if (matchdays.length === 0) {
      matchdayContent = <p>No matchdays found.</p>;
    } else {
      matchdayContent = (
        <>
          <label htmlFor="select-bet-matchday">Please select a matchday:</label>
          <select
            id="select-bet-matchday"
            value={selectedBetMatchday}
            onChange={(event) => {
              setSelectedBetMatchday(event.target.value);
            }}
          >
            {matchdays.map((matchday, index) => {
              return (
                <option key={`round ${index}`} value={matchday.round}>
                  {matchday.round}
                </option>
              );
            })}
          </select>
          <BetForm
            matchday={selectedBetMatchday}
            seasonId={selectedBettingSession.season_id}
            competitionId={selectedBettingSession.competition_id}
            userId={user?.id}
            bettingSessionId={selectedBettingSession.id}
          ></BetForm>
        </>
      );
    }
    if (previousMatchdays.length === 0) {
      previousMatchdayContent = <p>No matchdays found.</p>;
    } else {
      previousMatchdayContent = (
        <>
          <label htmlFor="select-previous-bet-matchday">
            Please select a matchday:
          </label>
          <select
            id="select-previous-bet-matchday"
            value={selectedPreviousMatchday}
            onChange={(event) => {
              setSelectedPreviousMatchday(event.target.value);
            }}
          >
            {previousMatchdays.map((matchday) => {
              return (
                <option key={matchday.round} value={matchday.round}>
                  {matchday.round}
                </option>
              );
            })}
          </select>
          <BetCardList
            matchday={selectedPreviousMatchday}
            bettingSessionId={selectedBettingSession.season_id}
            userId={user?.id}
          ></BetCardList>
        </>
      );
    }
  }

  let groupContent;
  if (groupsLoading) {
    groupContent = <p>loading...</p>;
  } else if (groupsError) {
    groupContent = <p className="error">Failed to fetch groups</p>;
  } else {
    if (groups.length === 0) {
      groupContent = <p>No groups found.</p>;
    } else {
      groupContent = (
        <>
          <label htmlFor="select-group">Please select a group:</label>
          <select
            id="select-group"
            value={selectedGroup}
            onChange={(event) => {
              setSelectedBettingSession("");
              setSelectedGroup(event.target.value);
            }}
          >
            <option key={"group-null"} value={""}>
              --Group--
            </option>
            {groups.map((group) => {
              return (
                <option key={`group-${group.id}`} value={group.group_id}>
                  {group.groups.name}
                </option>
              );
            })}
          </select>
        </>
      );
    }
  }

  let sessionContent;
  if (bettingSessionsLoading) {
    sessionContent = <p>loading...</p>;
  } else if (bettingSessionsError) {
    sessionContent = <p className="error">Failed to fetch sessions</p>;
  } else {
    if (bettingSessions.length === 0) {
      sessionContent = <p>No sessions found.</p>;
    } else {
      sessionContent = (
        <>
          <label htmlFor="select-session">Please select a session:</label>
          <select
            id="select-session"
            value={selectedBettingSession.id}
            onChange={(event) => {
              setSelectedBettingSession(
                event.target.value
                  ? bettingSessions.find((session) => {
                      return session.id === Number(event.target.value);
                    })
                  : "",
              );
            }}
          >
            <option key={"session-null"} value={""}>
              --Session--
            </option>
            {bettingSessions.map((session) => {
              return (
                <option key={`session-${session.id}`} value={session.id}>
                  {session.name}
                </option>
              );
            })}
          </select>
        </>
      );
    }
  }

  return (
    <>
      <section id="groups">
        <h2>Groups</h2>
        <div>{groupContent}</div>
        {!groupsError && selectedGroup && <div>{sessionContent}</div>}
      </section>
      {!groupsError && selectedGroup && selectedBettingSession && (
        <>
          <section id="group-standings">
            <h2>Standings</h2>
            <GroupTable
              bettingSessionId={selectedBettingSession.id}
            ></GroupTable>
          </section>

          <section id="bet-form">
            <h2>Bet</h2>
            {matchdayContent}
          </section>

          <section id="previous-bet">
            <h2>Prediction results</h2>
            {previousMatchdayContent}
          </section>
        </>
      )}
    </>
  );
}

export default Group;
