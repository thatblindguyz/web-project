import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  deleteProduct,
} from "../../../features/product/ProductSlice";

import { useNavigate } from "react-router-dom";
import ProductEdit from "../edit/ProductEdit";

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
      width: 130,

      renderCell: (params) => <CodeCell>#{params.row.code}</CodeCell>,
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
      width: 170,

      renderCell: (params) => <NameCell>{params.row.name}</NameCell>,
    },

    {
      field: "category",
      headerName: "Category",
      width: 140,
    },

    {
      field: "price",
      headerName: "Price",
      width: 130,

      renderCell: (params) => (
        <PriceCell>${params.row.price?.toLocaleString()}</PriceCell>
      ),
    },

    {
      field: "quantity",
      headerName: "Stock",
      width: 120,

      renderCell: (params) => (
        <StockCell
          $low={params.row.quantity <= 3 && params.row.quantity > 0}
          $out={params.row.quantity === 0}
        >
          {params.row.quantity}
        </StockCell>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 230,

      renderCell: (params) => (
        <Actions>
          {/* VIEW */}

          <View onClick={() => navigate(`/admin/product/${params.row._id}`)}>
            View
          </View>

          {/* EDIT */}

          <ProductEdit product={params.row} />

          {/* DELETE */}

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
        height: 520,
        width: "100%",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        rowHeight={90}
        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "15px",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #F1F5F9",
            fontSize: "16px",
            overflow: "visible !important",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F8FAFC",
            overflow: "visible !important",
          },
        }}
      />
    </Paper>
  );
};

export default ProductList;

/* ================= STYLES ================= */

const CodeCell = styled.span`
  font-family: monospace;
  font-size: 15px;
  color: #64748b;
`;

const NameCell = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  white-space: normal;
  line-height: 1.4;
  word-break: break-word;
`;

const PriceCell = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 52px;
    width: 52px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    height: 30px;
    padding: 0 10px;

    border-radius: 6px;

    font-size: 14px;

    font-weight: 500;

    cursor: pointer;

    transition: 0.15s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const View = styled.button`
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 0.5px solid #93c5fd;
`;

const Delete = styled.button`
  background-color: #fcebeb;
  color: #a32d2d;
  border: 0.5px solid #f7c1c1;
`;

const StockCell = styled.span`
  font-size: 15px;
  font-weight: 600;

  color: ${(p) =>
    p.$out
      ? "#dc2626" // đỏ (hết hàng)
      : p.$low
        ? "#d97706" // cam (ít hàng)
        : "#16a34a"}; // xanh (còn nhiều)
`;
