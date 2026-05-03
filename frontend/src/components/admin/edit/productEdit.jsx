import * as React from "react";
import styled from "styled-components";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { updateProduct } from "../../../features/product/ProductSlice";

const ProductEdit = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(product.code);
  const [name, setName] = React.useState(product.name);
  const [category, setCategory] = React.useState(product.category);
  const [price, setPrice] = React.useState(product.price);
  const [desc, setDesc] = React.useState(product.desc);
  const [productImg, setProductImg] = React.useState(product.image);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setProductImg(reader.result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        id: product._id,
        code,
        name,
        category,
        price,
        desc,
        image: productImg,
      }),
    );
    handleClose();
  };

  /* ── shared MUI TextField sx ── */
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "15px",
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#93C5FD" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1D4ED8",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1D4ED8" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
  };

  return (
    <>
      {/* BUTTON */}
      <EditButton onClick={handleClickOpen}>Edit</EditButton>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#1E293B",
            borderBottom: "1px solid #F1F5F9",
            pb: "14px",
          }}
        >
          Edit Product
        </DialogTitle>

        <DialogContent sx={{ pt: "20px !important" }}>
          <form onSubmit={handleSubmit} id="edit-form">
            {/* IMAGE UPLOAD */}
            <UploadLabel>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              Choose Image
            </UploadLabel>

            {productImg && (
              <ImagePreview>
                <img src={productImg} alt="preview" />
              </ImagePreview>
            )}

            {/* CODE */}
            <TextField
              margin="dense"
              label="Product Code"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              sx={fieldSx}
            />

            {/* NAME */}
            <TextField
              margin="dense"
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={fieldSx}
            />

            {/* CATEGORY */}
            <TextField
              select
              margin="dense"
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={fieldSx}
            >
              <MenuItem value="GPU">GPU</MenuItem>
              <MenuItem value="CPU">CPU</MenuItem>
              <MenuItem value="RAM">RAM</MenuItem>
              <MenuItem value="Monitor">Monitor</MenuItem>
            </TextField>

            {/* PRICE */}
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              inputProps={{ inputMode: "decimal", pattern: "[0-9]*" }}
              sx={{
                ...fieldSx,
                "& input[type=number]": { MozAppearance: "textfield" },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />

            {/* DESC */}
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              sx={fieldSx}
            />
          </form>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid #F1F5F9",
            px: "24px",
            py: "14px",
            gap: "8px",
          }}
        >
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
          <SubmitButton type="submit" form="edit-form">
            Update
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductEdit;

/* ================= STYLES ================= */
const EditButton = styled.button`
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
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 0.5px solid #93c5fd;

  &:hover {
    opacity: 0.82;
  }
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 14px;
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1d4ed8;
  background-color: #eff6ff;
  border: 0.5px solid #93c5fd;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.82;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  margin-bottom: 14px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  background-color: #f1f5f9;
  color: #64748b;
  border: 0.5px solid #cbd5e1;

  &:hover {
    opacity: 0.82;
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  background-color: #1d4ed8;
  color: #ffffff;
  border: none;

  &:hover {
    opacity: 0.88;
  }
`;
