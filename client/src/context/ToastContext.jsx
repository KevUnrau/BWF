import { createContext, useContext, useState } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function addToast(message, type) {
    const id = crypto.randomUUID();
    setToasts((prevToasts) => {
      return [...prevToasts, { id, message, type }];
    });
  }

  function removeToast(id) {
    setToasts((prevToasts) => {
      return prevToasts.filter((toast) => {
        return toast.id !== id;
      });
    });
  }

  const toast = {
    success: (message) => {
      addToast(message, "success");
    },
    error: (message) => {
      addToast(message, "error");
    },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer
        toasts={toasts}
        deleteHandler={removeToast}
      ></ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
