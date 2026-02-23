import { useEffect } from "react";
import Button from "./Button";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "600px",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        left: "0",
        bottom: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "between",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", flex: 1 }}>{title}</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ padding: "0.25rem" }}
          >
            <X size={20} />
          </Button>
        </div>
        <div style={{padding: '1.5rem', overflow: 'auto', flex: 1}}>
            {children}
        </div>
        {footer && (
            <div style={{padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
                {footer}
            </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
