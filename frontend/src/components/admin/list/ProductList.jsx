import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { useEffect, useState } from "react";
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
  const [confirmId, setConfirmId] = useState(null);
  // import useState từ react
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products } = useSelector((state) => state.products);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ================= DELETE PRODUCT ================= */

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(confirmId));
    setConfirmId(null);
  };

  /* ================= COLUMNS ================= */

  const columns = [
    {
      field: "code",
      headerName: "Mã sản phẩm",
      width: 130,

      renderCell: (params) => <CodeCell>#{params.row.code}</CodeCell>,
    },

    {
      field: "image",
      headerName: "Hình ảnh",
      width: 100,

      renderCell: (params) => (
        <ImageContainer>
          <img src={params.row.image} alt="product" />
        </ImageContainer>
      ),
    },

    {
      field: "name",
      headerName: "Tên sản phẩm",
      width: 170,

      renderCell: (params) => <NameCell>{params.row.name}</NameCell>,
    },

    {
      field: "category",
      headerName: "Danh mục",
      width: 140,
    },

    {
      field: "price",
      headerName: "Giá",
      width: 160,
      renderCell: (params) => {
        const { price, isDiscount, discountPercent } = params.row;
        if (isDiscount && discountPercent > 0) {
          const discounted = price * (1 - discountPercent / 100);
          return (
            <PriceCol>
              <NewPrice>{discounted.toLocaleString("vi-VN")}₫</NewPrice>
              <OldPriceRow>
                <OldPrice>{price?.toLocaleString("vi-VN")}₫</OldPrice>
                <DiscountBadge>-{discountPercent}%</DiscountBadge>
              </OldPriceRow>
            </PriceCol>
          );
        }
        return <PriceCell>{price?.toLocaleString("vi-VN")}₫</PriceCell>;
      },
    },

    {
      field: "quantity",
      headerName: "Kho",
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
      headerName: "Thao tác",
      width: 230,

      renderCell: (params) => (
        <Actions>
          {/* VIEW */}

          <View onClick={() => navigate(`/admin/product/${params.row._id}`)}>
            Xem
          </View>

          {/* EDIT */}

          <ProductEdit product={params.row} />

          {/* DELETE */}

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
          getRowHeight={() => "auto"}
          sx={{
            border: 0,

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #F1F5F9",
              fontSize: "16px",
              py: "8px",
            },

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

            "& .MuiDataGrid-cell[data-field='price']": {
              overflow: "visible !important",
              zIndex: 1,
            },
          }}
        />
      </Paper>
      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Xóa sản phẩm</ModalTitle>
            <ModalText>
              Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể
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

const PriceCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  height: 100%;
  width: 100%;
`;

const NewPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1d4ed8;
`;

const OldPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const OldPrice = styled.span`
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 4px;
  padding: 1px 5px;
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
