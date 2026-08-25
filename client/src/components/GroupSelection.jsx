import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData";

function GroupSelection({ changeHandler, selectedGroup }) {
  const { user } = useAuth();

  //fetch data
  const {
    data: groups,
    error,
    loading,
  } = useFetchData(user ? `/groups?userId=${user.id}` : null);

  useEffect(() => {
    if (groups && groups.length === 1) {
      changeHandler(groups[0].group_id);
    }
  }, [groups]);

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
        value={selectedGroup}
        onChange={(event) => {
          changeHandler(event.target.value);
        }}
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
