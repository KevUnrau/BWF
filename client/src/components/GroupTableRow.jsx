function GroupTableRow({ standing, position }) {
  return (
    <tr>
      <td className="number">{position}</td>
      <td className="text">{standing.users.username}</td>
      <td className="number">{standing.points}</td>
    </tr>
  );
}

export default GroupTableRow;
