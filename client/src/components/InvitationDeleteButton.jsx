function InvitationDeleteButton({ id, deleteHandler }) {
  return (
    <button
      className="ml-auto"
      onClick={() => {
        deleteHandler(id);
      }}
    >
      🗑️
    </button>
  );
}

export default InvitationDeleteButton;
