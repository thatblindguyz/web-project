import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../features/user/UserSlice";

/* ============================
   COMPONENT
============================ */
const UserList = () => {
  const dispatch = useDispatch();
  const { items: users } = useSelector((state) => state.users);
  const [confirmId, setConfirmId] = useState(null);
  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /* ================= DELETE USER ================= */
  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = () => {
    dispatch(deleteUser(confirmId));
    setConfirmId(null);
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      field: "name",
      headerName: "Tên",
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
      headerName: "Ngày đăng kí",
      width: 150,
      renderCell: (params) =>
        new Date(params.row.createdAt).toLocaleDateString("vi-VN"),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 100,
      renderCell: (params) => (
        <Actions>
          <Delete onClick={() => handleDelete(params.row._id)}>Xóa</Delete>
        </Actions>
      ),
    },
  ];

  /* ================= TABLE ================= */
  return (
    <>
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
      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Xóa người dùng</ModalTitle>
            <ModalText>
              Bạn có chắc muốn xóa người dùng này không? Hành động này không thể
              hoàn tác.
            </ModalText>
            <ModalActions>
              <ModalCancel onClick={() => setConfirmId(null)}>
                Quay lại
              </ModalCancel>
              <ModalConfirm onClick={confirmDelete}>Xóa</ModalConfirm>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const ModalText = styled.p`
  font-size: 14px;
  color: #475569;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalCancel = styled.button`
  padding: 0 14px;
  height: 32px;
  background: #f8fafc;
  color: #475569;
  border: 0.5px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;

const ModalConfirm = styled.button`
  padding: 0 14px;
  height: 32px;
  background-color: #fcebeb;
  color: #a32d2d;
  border: 0.5px solid #f7c1c1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;
