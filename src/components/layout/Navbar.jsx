import { LayoutDashboard, ListChecks, ShoppingCart, Warehouse } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/orders", label: "All Orders", icon: <ListChecks size={18} /> },
    { path: "/place-order", label: "Place Order", icon: <ShoppingCart size={18} /> },
    { path: "/warehouse/1/stock", label: "Warehouse Stock", icon: <Warehouse size={18} /> },
  ];

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
    fontSize: "0.925rem",
    fontWeight: "500",
    color: isActive ? "var(--primary)" : "var(--text-muted)",
    backgroundColor: isActive ? "#eff6ff" : "transparent",
    transition: "all 0.2s ease",
    flex: 1,
  });

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border)",
        padding: "0.5rem 0",
        position: "sticky",
        top: "64px",
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} style={linkStyle}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
