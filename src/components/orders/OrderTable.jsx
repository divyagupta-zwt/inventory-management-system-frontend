import OrderRow from "./OrderRow";
import { ArrowUpDown, AlertCircle } from "lucide-react";

const OrderTable = ({
  orders = [],
  filteredOrders = [],
  onView,
  onCancel,
  onSort,
  sortBy,
}) => {
  const thStyle = {
    padding: "1rem",
    color: "var(--text-muted)",
    fontWeight: "600",
    fontSize: "0.875rem",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Warehouse</th>

            <th
              style={{ ...thStyle, cursor: "pointer" }}
              onClick={() => onSort("date")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Order Date
                <ArrowUpDown size={14} opacity={sortBy === "date" ? 1 : 0.3} />
              </div>
            </th>

            <th style={thStyle}>Status</th>

            <th
              style={{ ...thStyle, cursor: "pointer" }}
              onClick={() => onSort("amount")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Total Amount
                <ArrowUpDown size={14} opacity={sortBy === "amount" ? 1 : 0.3} />
              </div>
            </th>

            <th style={{ ...thStyle, width: "100px", paddingLeft: '35px' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {(!orders || orders.length === 0) && (
            <tr>
              <td colSpan={7} style={{ padding: "4rem", textAlign: "center" }}>
                <div style={{ opacity: 0.5 }}>
                  <AlertCircle size={48} style={{ margin: "0 auto 1rem" }} />
                  <p style={{ fontSize: "1.125rem", fontWeight: 500 }}>
                    No orders found.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {orders?.length > 0 && filteredOrders.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: "4rem", textAlign: "center" }}>
                <div style={{ opacity: 0.5 }}>
                  <AlertCircle size={48} style={{ margin: "0 auto 1rem" }} />
                  <p style={{ fontSize: "1.125rem", fontWeight: 500 }}>
                    No orders match your search or filter criteria
                  </p>
                </div>
              </td>
            </tr>
          )}

          {filteredOrders.length > 0 &&
            filteredOrders.map((order) => (
              <OrderRow
                key={order.order_id}
                order={order}
                onView={onView}
                onCancel={onCancel}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;