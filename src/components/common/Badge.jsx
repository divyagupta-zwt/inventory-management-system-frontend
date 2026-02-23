const Badge = ({ children, variant = "info" }) => {
  const variants = {
    info: { backgroundColor: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    success: { backgroundColor: "#dcfce7", color: "#166534", dot: "#22c55e" },
    danger: { backgroundColor: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    warning: { backgroundColor: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    neutral: { backgroundColor: "#f1f5f9", color: "#475569", dot: "#64748b" },
  };

  const style = variants[variant] || variants.info;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      {/* Dot */}
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: style.dot,
        }}
      />

      {children}
    </span>
  );
};

export default Badge;
