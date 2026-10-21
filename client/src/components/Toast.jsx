import Button from "./Button";

function Toast({ message, type, deleteHandler }) {
  const styles = { success: "bg-green-600", error: "bg-red-600" };
  return (
    <div
      className={`${styles[type]} flex items-center gap-3 rounded p-4 text-white shadow-lg`}
    >
      <span>{message}</span>
      <Button variant="icon" type="button" onClick={deleteHandler}>
        x
      </Button>
    </div>
  );
}

export default Toast;
