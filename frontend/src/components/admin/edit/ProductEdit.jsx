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

import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../../features/product/ProductSlice";

const ProductEdit = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(product.code);
  const [isDiscount, setIsDiscount] = React.useState(
    product.isDiscount || false,
  );
  const [discountPercent, setDiscountPercent] = React.useState(
    product.discountPercent || 0,
  );
  const [name, setName] = React.useState(product.name);
  const [category, setCategory] = React.useState(product.category);
  const [price, setPrice] = React.useState(product.price);
  const [quantity, setQuantity] = React.useState(product.quantity);
  const [desc, setDesc] = React.useState(product.desc);

  const [selectedImage, setSelectedImage] = useState(0);
  const [productImages, setProductImages] = React.useState(
    product.images?.length > 0 ? product.images : [product.image],
  );

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const base64Images = [];

    for (let file of files) {
      const reader = new FileReader();

      const promise = new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });

      reader.readAsDataURL(file);

      const result = await promise;

      base64Images.push(result);
    }

    setProductImages(base64Images);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateProduct({
        id: product._id,
        code,
        name,
        category,
        price,
        quantity,
        desc,
        image: productImages[selectedImage],
        images: productImages,
        isDiscount,
        discountPercent,
      }),
    );

    handleClose();
  };

  return (
    <>
      {/* BUTTON */}
      <EditButton onClick={handleClickOpen}>Chỉnh sửa</EditButton>

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
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              Choose Image
            </UploadLabel>

            {productImages.length > 0 && (
              <PreviewGrid>
                {productImages.map((img, index) => (
                  <PreviewItem
                    key={index}
                    $active={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt="" />

                    {selectedImage === index && (
                      <SelectedBadge>Ảnh đại diện</SelectedBadge>
                    )}
                  </PreviewItem>
                ))}
              </PreviewGrid>
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
              label="Price (₫)"
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

            {/* QUANTITY */}
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              sx={{
                ...fieldSx,
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
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

            {/* DISCOUNT ENABLE */}
            <DiscountToggle>
              <DiscountCheckbox
                type="checkbox"
                id="discount-toggle"
                checked={isDiscount}
                onChange={(e) => setIsDiscount(e.target.checked)}
              />
              <DiscountLabel htmlFor="discount-toggle">
                Enable Discount
              </DiscountLabel>
            </DiscountToggle>

            {/* DISCOUNT PERCENT */}
            {isDiscount && (
              <TextField
                margin="dense"
                label="Discount %"
                type="number"
                fullWidth
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                sx={fieldSx}
              />
            )}

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

// const ImagePreview = styled.div`
//   margin-bottom: 14px;

//   img {
//     width: 80px;
//     height: 80px;
//     object-fit: cover;
//     border-radius: 8px;
//     border: 1px solid #e2e8f0;
//   }
// `;

const PreviewGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));

  gap: 10px;

  margin-bottom: 14px;

  img {
    width: 100%;
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

const DiscountToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const DiscountCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #1d4ed8;
  cursor: pointer;
  flex-shrink: 0;
`;

const DiscountLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? "#1d4ed8" : "#e2e8f0")};
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  box-shadow: ${(p) => (p.$active ? "0 0 0 3px rgba(29,78,216,0.12)" : "none")};

  &:hover {
    border-color: ${(p) => (p.$active ? "#1d4ed8" : "#93c5fd")};
  }

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    display: block;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(29, 78, 216, 0.85);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 0;
  text-align: center;
  letter-spacing: 0.03em;
  backdrop-filter: blur(2px);
`;
