import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts, deleteProduct } from "../../../features/productSlice";
import { useNavigate } from "react-router-dom";

/* ============================
   COMPONENT
============================ */

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products } = useSelector((state) => state.products);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ================= DELETE PRODUCT ================= */

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    dispatch(deleteProduct(id));
  };

  /* ================= COLUMNS ================= */

  const columns = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },

    {
      field: "image",
      headerName: "Image",
      width: 100,

      renderCell: (params) => (
        <ImageContainer>
          <img src={params.row.image} alt="product" />
        </ImageContainer>
      ),
    },

    {
      field: "name",
      headerName: "Name",
      width: 150,
    },

    {
      field: "price",
      headerName: "Price",
      width: 120,

      renderCell: (params) => (
        <span>${params.row.price?.toLocaleString()}</span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,

      renderCell: (params) => (
        <Actions>
          <View onClick={() => navigate(`/admin/product/${params.row._id}`)}>
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
        rows={products}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,

          "& .MuiDataGrid-cell": {
            display: "flex",

            alignItems: "center",
          },
        }}
      />
    </Paper>
  );
};

export default ProductList;

/* ================= STYLES ================= */

const ImageContainer = styled.div`
  img {
    height: 40px;

    width: 40px;

    object-fit: cover;
  }
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

    height: 26px;

    padding: 0 10px;

    border: none;

    outline: none;

    border-radius: 6px;

    font-size: 12px;

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

const View = styled.button`
  background-color: #eaf3de;

  color: #3b6d11;

  border: 0.5px solid #c0dd97 !important;
`;
