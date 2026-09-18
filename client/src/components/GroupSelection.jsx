import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData";

function GroupSelection({ selectedGroup }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  //fetch data
  const {
    data: groups,
    error,
    loading,
  } = useFetchData(user ? `/groups?userId=${user.id}` : null);

  if (!user) {
    return;
  }

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="error">Failed to fetch groups</p>;
  }

  if (!groups || groups.length === 0) {
    return <p>No groups found.</p>;
  }

  const options = groups.map((group) => {
    return (
      <option value={group.group_id} key={`group-${group.group_id}`}>
        {group.groups.name}
      </option>
    );
  });

  return (
    <>
      <label htmlFor="select-group">Please select a group:</label>
      <select
        id="select-group"
        onChange={(event) => {
          const groupId = event.target.value;
          if (groupId) {
            navigate(`/group/${groupId}`);
          } else {
            navigate("/groups");
          }
        }}
        value={selectedGroup ? selectedGroup : ""}
      >
        <option key={"group-null"} value={""}>
          --Group--
        </option>
        {options}
      </select>
    </>
  );
}

export default GroupSelection;
