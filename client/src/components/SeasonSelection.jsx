import { useFetchData } from "../hooks/useFetchData";

function SeasonSelection({
  selectedCompetition,
  selectedSeason,
  changeHandler,
}) {
  const {
    data: seasons,
    error,
    loading,
  } = useFetchData(
    selectedCompetition ? `/competitions/${selectedCompetition}/seasons` : null,
  );

  if (!selectedCompetition) {
    return <p>Please select a competition to view seasons.</p>;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch seasons.</p>;
  }

  if (!seasons || seasons.length === 0) {
    return <p>No seasons found.</p>;
  }

  const seasonOptions = seasons.map((season) => {
    return (
      <option key={`season-${season.id}`} value={season.id}>
        {season.name}
      </option>
    );
  });

  return (
    <>
      <label htmlFor="season">Season:</label>
      <select
        value={selectedSeason}
        id="season"
        onChange={(event) => {
          changeHandler(event.target.value);
        }}
      >
        <option value={""}>--Season--</option>
        {seasonOptions}
      </select>
    </>
  );
}

export default SeasonSelection;
