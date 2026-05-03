import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../features/user/UserSlice";

/* ============================
   COMPONENT
============================ */
const UserList = () => {
  const dispatch = useDispatch();
  const { items: users } = useSelector((state) => state.users);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /* ================= DELETE USER ================= */
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;
    dispatch(deleteUser(id));
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params) => <NameCell>{params.row.name}</NameCell>,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => <EmailCell>{params.row.email}</EmailCell>,
    },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 150,
      renderCell: (params) =>
        new Date(params.row.createdAt).toLocaleDateString("vi-VN"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Actions>
          <Delete onClick={() => handleDelete(params.row._id)}>Delete</Delete>
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
        rows={users}
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

export default UserList;

/* ================= STYLES ================= */

const NameCell = styled.span`
  font-size: 17px;
  font-weight: 500;
  color: #1e293b;
`;

const EmailCell = styled.span`
  font-size: 16px;
  color: #475569;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding: 0 12px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.82;
    }
  }
`;

const Delete = styled.button`
  background-color: #fcebeb;
  color: #a32d2d;
  border: 0.5px solid #f7c1c1 !important;
`;
