import Toast from "./Toast";

function ToastContainer({ toasts, deleteHandler }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        return (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            deleteHandler={() => {
              deleteHandler(toast.id);
            }}
          ></Toast>
        );
      })}
    </div>
  );
}

export default ToastContainer;
