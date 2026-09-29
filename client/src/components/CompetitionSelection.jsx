import { useFetchData } from "../hooks/useFetchData";

function CompetitionSelection({ changeHandler, selectedCompetition }) {
  const { data: competitions, error, loading } = useFetchData("/competitions");

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch competitions.</p>;
  }

  if (!competitions || competitions.length === 0) {
    return <p>No competitions found.</p>;
  }

  const competitionOptions = competitions.map((competition) => {
    return (
      <option key={`competition-${competition.id}`} value={competition.id}>
        {competition.name}
      </option>
    );
  });

  return (
    <>
      <label htmlFor="competition">Competition:</label>
      <select
        value={selectedCompetition}
        id="competition"
        onChange={(event) => {
          changeHandler(event.target.value);
        }}
      >
        <option value={""}>--Competition--</option>
        {competitionOptions}
      </select>
    </>
  );
}

export default CompetitionSelection;
