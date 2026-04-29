import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { fetchUsers, deleteUser } from "../../../features/userSlice";

/* ============================
   COMPONENT
============================ */

const UserList = () => {
  const navigate = useNavigate();

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
      field: "_id",
      headerName: "ID",
      width: 220,
    },

    {
      field: "name",
      headerName: "Name",
      width: 150,
    },

    {
      field: "email",
      headerName: "Email",
      width: 200,
    },

    {
      field: "isAdmin",
      headerName: "Admin",
      width: 100,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,

      renderCell: (params) => (
        <Actions>
          <View onClick={() => navigate(`/admin/user/${params.row._id}`)}>
            View
          </View>

          <Delete onClick={() => handleDelete(params.row._id)}>Delete</Delete>
        </Actions>
      ),
    },
  ];

  /* ================= TABLE ================= */

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Paper>
  );
};

export default UserList;

/* ================= STYLES ================= */

const Actions = styled.div`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 6px;
`;

const Delete = styled.button`
  background-color: #fcebeb;

  color: #a32d2d;

  border: 0.5px solid #f7c1c1;

  padding: 5px 10px;

  border-radius: 6px;

  cursor: pointer;
`;

const View = styled.button`
  background-color: #eaf3de;

  color: #3b6d11;

  border: 0.5px solid #c0dd97;

  padding: 5px 10px;

  border-radius: 6px;

  cursor: pointer;
`;
