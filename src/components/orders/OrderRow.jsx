import { Eye, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../common/Badge";
import Button from "../common/Button";

const OrderRow = ({ order, onView, onCancel }) => {
  return (
    <tr
      style={{
        borderBottom: "1px solid #f1f5f9",
        transition: "background-color 0.2s",
      }}
      className="hover:bg-slate-50"
    >
      <td style={{ padding: "1rem", fontWeight: "600" }}>#{order.order_id}</td>
      <td style={{ padding: "1rem" }}>
        <p style={{ fontWeight: "500" }}>{order.customer_name}</p>
      </td>
      <td style={{ padding: "1rem" }}>
        <p style={{ fontSize: "0.875rem" }}>
          {order.warehouse_name || `Warehouse ${order.warehouse_id}`}
        </p>
      </td>
      <td
        style={{
          padding: "1rem",
          color: "var(--text-muted)",
          fontSize: "0.875rem",
        }}
      >
        {formatDate(order.order_date)}
      </td>
      <td style={{ padding: "1rem" }}>
        <Badge
          variant={
            order.status === "COMPLETED"
              ? "success"
              : order.status === "CANCELLED"
                ? "danger"
                : "info"
          }
        >
          {order.status}
        </Badge>
      </td>
      <td style={{ padding: "1rem", fontWeight: "600" }}>
        {formatCurrency(order.total_amount || 0)}
      </td>
      <td style={{ padding: "1rem", marginLeft: 0 }}>
        <div style={{ display: "flex" }}>
          <span title="View Order">
            <Button
            variant="ghost"
            onClick={() => onView(order)}
            style={{ padding: "0.4rem" }}
          >
            <Eye size={18} />
          </Button>
          </span>
          {order.status === "PLACED" && (
            <span title="Cancel Order">
              <Button
              variant="ghost"
              onClick={() => onCancel(order)}
              style={{ padding: "0.4rem", color: "var(--danger)" }}
            >
              <XCircle size={18} />
            </Button>
            </span>
          )}
        </div>
      </td>
      <style>{`
        tr:hover { background-color: #f8fafc; }
      `}</style>
    </tr>
  );
};

export default OrderRow;