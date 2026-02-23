import { useEffect, useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useWarehouses } from "../hooks/useWarehouses";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import orderService from "../services/orderService";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";
import OrderRow from "../components/orders/OrderRow";
import OrderTable from "../components/orders/OrderTable";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import Modal from "../components/common/Modal";

const OrdersList = () => {
  const { data: orders, loading, error, refetch } = useOrders();
  const { data: warehouses } = useWarehouses();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedWarehouse, setSelectedWarehouse] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders
      .filter((order) => {
        const matchesSearch = order.customer_name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase());
        const matchesStatus =
          selectedStatus === "ALL" || order.status === selectedStatus;
        const matchesWarehouse =
          selectedWarehouse === "ALL" ||
          order.warehouse_id === parseInt(selectedWarehouse);
        return matchesSearch && matchesStatus && matchesWarehouse;
      })
      .sort((a, b) => {
        let valueA, valueB;
        if (sortBy === "date") {
          valueA = new Date(a.order_date);
          valueB = new Date(b.order_date);
        } else {
          valueA = a.total_amount || 0;
          valueB = b.total_amount || 0;
        }
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
  }, [
    orders,
    debouncedSearch,
    selectedStatus,
    selectedWarehouse,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const pagedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setCancelling(true);
      await orderService.cancelOrder(orderToCancel.order_id);
      setSuccessMessage(
        `Order #${orderToCancel.order_id} cancelled successfully`,
      );
      setShowConfirmCancel(false);
      refetch();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      alert(error.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const openCancelConfirm = (order) => {
    setOrderToCancel(order);
    setShowConfirmCancel(true);
  };

  // const thStyle= { padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' };

  if (loading && !orders.length) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "1.875rem" }}>Order Management</h1>
        {successMessage && (
          <div
            style={{
              backgroundColor: "#bcfce7",
              color: "#166534",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid #bbfcce",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {successMessage}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.625rem 1rem 0.625rem 2.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                outline: "none",
                fontSize: "0.925rem",
              }}
            />
            {searchTerm && (
              <X
                size={16}
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="ALL">All Orders</option>
            <option value="PLACED">Placed Orders</option>
            <option value="COMPLETED">Completed Orders</option>
            <option value="CANCELLED">Cancelled Orders</option>
          </select>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="ALL">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id}>
                {w.warehouse_name}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("ALL");
              setSelectedWarehouse("ALL");
              setCurrentPage(1);
            }}
          >
            Clear
          </Button>
        </div>

        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          {filteredOrders.length} results found
          {(selectedStatus !== "ALL" ||
            selectedWarehouse !== "ALL" ||
            debouncedSearch) && (
            <span style={{ marginLeft: "0.5rem", fontStyle: "italic" }}>
              (Filters active)
            </span>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <OrderTable
            orders={orders}
            filteredOrders={pagedOrders}
            onView={openDetails}
            onCancel={openCancelConfirm}
            onSort={handleSort}
            sortBy={sortBy}
          />
        </div>

        {totalPages > 1 && (
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Page {currentPage} of {totalPages}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: "0.4rem 0.75rem" }}
              >
                <ChevronLeft size={18} />
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{ padding: "0.4rem 0.75rem" }}
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />

      <Modal
        isOpen={showConfirmCancel}
        onClose={() => !cancelling && setShowConfirmCancel(false)}
        title="Confirm Cancellation"
        maxWidth="400px"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmCancel(false)}
              disabled={cancelling}
            >
              Go Back
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              loading={cancelling}
            >
              Cancel Order
            </Button>
          </>
        }
      >
        <p style={{ lineHeight: "1.6" }}>
          Are you sure you want to cancel{" "}
          <strong>Order #{orderToCancel?.order_id} </strong>? This action cannot
          be undone and stock will be restored to the warehouse.
        </p>
      </Modal>
    </div>
  );
};

export default OrdersList;
