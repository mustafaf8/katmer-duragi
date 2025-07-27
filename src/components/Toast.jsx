import React, { useEffect } from "react";

function Toast({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
