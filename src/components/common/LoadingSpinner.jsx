const LoadingSpinner = ({
  size = 40,
  color = "var(--primary)",
  fullPage = false,
}) => {
  const spinner = (
    <div
      className="spinner-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "spin 1.2s linear infinite" }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`
                @keyframes spin{
                    to {transform: rotate(360deg);}
                }
            `}</style>
    </div>
  );

  if (fullPage) {
    return(
        <div style={{position: "fixed", top: "0", right: "0", left: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999, backdropFilter: "blur(2px)"}}>
            {spinner}
            <p style={{marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '500'}}>Loading...</p>
        </div>
    );
  }
};

export default LoadingSpinner;
