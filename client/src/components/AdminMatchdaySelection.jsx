import MatchdaySelection from "./MatchdaySelection";
import { useFetchData } from "../hooks/useFetchData";

function AdminMatchdaySelection({
  competition,
  season,
  changeHandler,
  selectedMatchday,
}) {
  const {
    data: matchdays,
    loading,
    error,
  } = useFetchData(
    competition && season
      ? `/competitions/${competition}/season/${season}/matchdays`
      : null,
  );
  if (!competition) {
    return;
  }
  if (!season) {
    return <p>Please select a season to view matchdays.</p>;
  }
  return (
    <MatchdaySelection
      matchdays={matchdays}
      loading={loading}
      error={error}
      changeHandler={changeHandler}
      selectedMatchday={selectedMatchday}
    ></MatchdaySelection>
  );
}

export default AdminMatchdaySelection;
