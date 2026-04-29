import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { fetchOrders } from "../../../features/orderSlice";

/* ============================
   COMPONENT
============================ */

const OrderList = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { items: orders } = useSelector((state) => state.orders);

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
    },

    {
      field: "userId",
      headerName: "User",
      width: 150,

      renderCell: (params) => <span>{params.row.userId?.name}</span>,
    },

    {
      field: "total",
      headerName: "Amount",
      width: 120,

      renderCell: (params) => <span>${params.row.total}</span>,
    },

    {
      field: "delivery_status",
      headerName: "Delivery",
      width: 140,

      renderCell: (params) => <span>{params.row.delivery_status}</span>,
    },

    {
      field: "payment_status",
      headerName: "Payment",
      width: 140,

      renderCell: (params) => <span>{params.row.payment_status}</span>,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,

      renderCell: (params) => (
        <Actions>
          <View onClick={() => navigate(`/admin/order/${params.row._id}`)}>
            View
          </View>
        </Actions>
      ),
    },
  ];

  /* ================= TABLE ================= */

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Paper>
  );
};

export default OrderList;

/* ================= STYLES ================= */

const Actions = styled.div`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 6px;
`;

const View = styled.button`
  background-color: #eaf3de;

  color: #3b6d11;

  border: 0.5px solid #c0dd97;

  padding: 5px 10px;

  border-radius: 6px;

  cursor: pointer;
`;
