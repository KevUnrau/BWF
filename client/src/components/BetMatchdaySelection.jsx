import { useFetchData } from "../hooks/useFetchData";
import { useEffect } from "react";
import MatchdaySelection from "./MatchdaySelection";

function BetMatchdaySelection({
  session,
  status,
  changeHandler,
  selectedMatchday,
  initValue,
}) {
  const {
    data: matchdays,
    error,
    loading,
  } = useFetchData(
    session ? `/sessions/${session}/matchdays?status=${status}` : null,
  );

  useEffect(() => {
    if (!matchdays) {
      return;
    }
    if (initValue === "min") {
      changeHandler(
        matchdays.reduce((previousValue, currentValue) => {
          if (previousValue.round < currentValue.round) {
            return previousValue;
          } else {
            return currentValue;
          }
        }, matchdays[0]),
      );
    } else {
      changeHandler(
        matchdays.reduce((previousValue, currentValue) => {
          if (previousValue.round > currentValue.round) {
            return previousValue;
          } else {
            return currentValue;
          }
        }, matchdays[0]),
      );
    }
  }, [matchdays, initValue]);

  if (!session) {
    return <p>Please select a betting session to view matchdays.</p>;
  }

  return (
    <MatchdaySelection
      matchdays={matchdays}
      loading={loading}
      error={error}
      selectedMatchday={selectedMatchday}
      changeHandler={changeHandler}
    ></MatchdaySelection>
  );
}

export default BetMatchdaySelection;
