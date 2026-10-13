function Toast({ message, type, deleteHandler }) {
  const styles = { success: "bg-green-600", error: "bg-red-600" };
  return (
    <div
      className={`${styles[type]} flex items-center gap-3 rounded p-4 text-white shadow-lg`}
    >
      <span>{message}</span>
      <button type="button" onClick={deleteHandler}>
        x
      </button>
    </div>
  );
}

export default Toast;
