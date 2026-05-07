import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../../features/order/OrderSlice";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

/* ============================
   HELPERS
============================ */

const deliveryColors = {
  pending: { bg: "#FEF9EC", color: "#92600A", border: "#FAC765" },
  processing: { bg: "#EEF2FF", color: "#3730A3", border: "#A5B4FC" },
  dispatched: { bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
  delivered: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
};

const paymentColors = {
  pending: { bg: "#FEF9EC", color: "#92600A", border: "#FAC765" },
  paid: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  failed: { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
  refunded: { bg: "#F5F0FF", color: "#5B21B6", border: "#C4B5FD" },
};

const getDeliveryStyle = (status = "") =>
  deliveryColors[status.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  };

const getPaymentStyle = (status = "") =>
  paymentColors[status.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  };

/* ============================
   COMPONENT
============================ */
const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: orders } = useSelector((state) => state.orders);
  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure to set this order to ${status}?`,
    );

    if (!confirmAction) return;

    try {
      await axios.put(`${url}/orders/delivery/${id}`, { status }, setHeaders());

      // reload lại data
      dispatch(fetchOrders());
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  /* ================= COLUMNS ================= */
  const columns = [
    {
      field: "_id",
      headerName: "Order ID",
      width: 220,
      renderCell: (params) => (
        <OrderId>#{params.row._id?.slice(-8).toUpperCase()}</OrderId>
      ),
    },

    {
      field: "total",
      headerName: "Amount",
      width: 140,
      renderCell: (params) => (
        <Amount>{params.row.total?.toLocaleString("vi-VN")}₫</Amount>
      ),
    },

    {
      field: "delivery_status",
      headerName: "Delivery",
      width: 150,
      renderCell: (params) => {
        const status = params.row.delivery_status ?? "";
        const style = getDeliveryStyle(status);
        return (
          <StatusBadge
            $bg={style.bg}
            $color={style.color}
            $border={style.border}
          >
            {status || "—"}
          </StatusBadge>
        );
      },
    },

    {
      field: "payment_status",
      headerName: "Payment",
      width: 150,
      renderCell: (params) => {
        const status = params.row.payment_status ?? "";
        const style = getPaymentStyle(status);
        return (
          <StatusBadge
            $bg={style.bg}
            $color={style.color}
            $border={style.border}
          >
            {status || "—"}
          </StatusBadge>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 260,
      renderCell: (params) => (
        <Actions>
          <View onClick={() => navigate(`/admin/order/${params.row._id}`)}>
            View
          </View>

          {/* DELIVERY BUTTON */}

          {params.row.delivery_status !== "delivering" &&
            params.row.delivery_status !== "delivered" &&
            params.row.delivery_status !== "cancelled" && (
              <ActionBtn
                onClick={() => updateStatus(params.row._id, "delivering")}
              >
                Delivery
              </ActionBtn>
            )}

          {/* COMPLETE BUTTON */}

          {params.row.delivery_status !== "delivered" &&
            params.row.delivery_status !== "cancelled" && (
              <ActionBtnGreen
                onClick={() => updateStatus(params.row._id, "delivered")}
              >
                Complete
              </ActionBtnGreen>
            )}
        </Actions>
      ),
    },
  ];

  /* ================= TABLE ================= */
  return (
    <Paper
      elevation={0}
      sx={{
        height: 500,
        width: "100%",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          fontFamily: "inherit",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "15px",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #F1F5F9",
            fontSize: "17px",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F8FAFC",
          },
          "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
            borderBottom: 0,
          },
          "& .MuiCheckbox-root": {
            color: "#CBD5E1",
          },
          "& .MuiCheckbox-root.Mui-checked": {
            color: "#1D4ED8",
          },
        }}
      />
    </Paper>
  );
};

export default OrderList;

/* ================= STYLES ================= */
const OrderId = styled.span`
  font-family: monospace;
  font-size: 15px;
  color: #64748b;
  letter-spacing: 0.04em;
`;

const Amount = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 0.5px solid ${(p) => p.$border};
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const View = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 0.5px solid #93c5fd;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.82;
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  background-color: #eef2ff;
  color: #3730a3;
  border: 0.5px solid #a5b4fc;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;

const ActionBtnGreen = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  background-color: #e1f5ee;
  color: #0f6e56;
  border: 0.5px solid #5dcaa5;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;
