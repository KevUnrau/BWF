function SportsTableRow({ club }) {
  return (
    <tr>
      <td className="number">{club.position}</td>
      <td className="text">{club.name}</td>
      <td className="number">{club.totalGames}</td>
      <td className="number">{club.totalWins}</td>
      <td className="number">{club.totalDraws}</td>
      <td className="number">{club.totalLosses}</td>
      <td className="number">{club.totalGoals}</td>
      <td className="number">{club.totalGoalsConceded}</td>
      <td className="number">{club.totalGoalDifference}</td>
      <td className="number">{club.totalPoints}</td>
    </tr>
  );
}

export default SportsTableRow;
