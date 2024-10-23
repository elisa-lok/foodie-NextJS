"use client";

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;

    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };

    if (open) {
      modal.showModal();
      modal.addEventListener("cancel", handleCancel);
    } else if (modal.open) {
      modal.close();
    }

    return () => {
      if (modal.open) {
        modal.close();
      }
      modal.removeEventListener("cancel", handleCancel);
    };
  }, [open, onClose]);

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>
      {children}
    </dialog>,
    document.getElementById("modal") || document.body
  );
}
