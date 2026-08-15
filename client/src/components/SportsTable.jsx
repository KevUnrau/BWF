import SportsTableRow from "./SportsTableRow";

function SportsTable({ clubs }) {
  const tableRows = clubs.map((club) => {
    return <SportsTableRow club={club} key={club.id}></SportsTableRow>;
  });

  return (
    <table className="sportsTable">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>Pl</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
}

export default SportsTable;
