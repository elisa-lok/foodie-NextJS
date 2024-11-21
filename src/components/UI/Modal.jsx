import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className }) {
  const dialog = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !dialog.current) return;

    const modal = dialog.current;

    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };

    if (open) {
      modal.showModal();
      modal.addEventListener("cancel", handleCancel);
      document.body.style.overflow = "hidden";
    } else if (modal.open) {
      modal.close();
      document.body.style.overflow = "";
    }

    return () => {
      if (modal?.open) {
        modal.close();
      }
      modal?.removeEventListener("cancel", handleCancel);
      document.body.style.overflow = "";
    };
  }, [open, onClose, isClient]);

  if (!isClient) return null;

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>
      {children}
    </dialog>,
    document.getElementById("modal") || document.body
  );
}
