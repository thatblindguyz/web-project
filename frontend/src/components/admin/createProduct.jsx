import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createProducts } from "../../features/productSlice";

/* ============================
   COMPONENT
============================ */
const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus } = useSelector((state) => state.products);

  const [productImg, setProductImg] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [priceError, setPriceError] = useState("");
  const [code, setCode] = useState("");

  /* ================= IMAGE UPLOAD ================= */
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => setProductImg(reader.result);
    } else {
      setProductImg("");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!price || price <= 0) {
      setPriceError("Price must be greater than 0");
      return;
    }

    setPriceError("");

    dispatch(
      createProducts({
        code,
        name,
        category,
        price,
        desc,
        image: productImg,
      }),
    );

    // reset form
    setName("");
    setCode("");
    setCategory("");
    setPrice("");
    setDesc("");
    setProductImg("");
  };

  /* ================= UI ================= */
  return (
    <Wrapper>
      {/* ===== HEADER ===== */}
      <Header>
        <Left>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          <PageTitle>Create Product</PageTitle>
        </Left>
      </Header>

      {/* ===== MAIN CARD ===== */}
      <ContentRow>
        {/* FORM */}
        <Card>
          <CardTitle>Product Info</CardTitle>
          <StyledForm onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <FieldLabel>Product Image</FieldLabel>
              <FileInput
                id="imgUpload"
                accept="image/*"
                type="file"
                onChange={handleProductImageUpload}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Category</FieldLabel>
              <StyledSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="GPU">GPU</option>
                <option value="RAM">RAM</option>
                <option value="CPU">CPU</option>
                <option value="Monitor">Monitor</option>
              </StyledSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Product Code</FieldLabel>
              <StyledInput
                type="text"
                placeholder="e.g. RTX4090"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Name</FieldLabel>
              <StyledInput
                type="text"
                placeholder="e.g. RTX 4090"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Price ($)</FieldLabel>
              <StyledInput
                type="number"
                placeholder="e.g. 3999"
                value={price}
                step="0.01"
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (e.target.value > 0) setPriceError("");
                }}
                required
              />
              {priceError && <ErrorText>{priceError}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Description</FieldLabel>
              <StyledInput
                type="text"
                placeholder="Short description..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </FieldGroup>

            <SubmitButton type="submit" disabled={createStatus === "pending"}>
              {createStatus === "pending" ? "Submitting..." : "Create Product"}
            </SubmitButton>
          </StyledForm>
        </Card>

        {/* IMAGE PREVIEW */}
        <Card>
          <CardTitle>Image Preview</CardTitle>
          <ImagePreview>
            {productImg ? (
              <img src={productImg} alt="preview" />
            ) : (
              <Placeholder>
                <PlaceholderIcon>🖼</PlaceholderIcon>
                <p>Upload an image to see preview</p>
              </Placeholder>
            )}
          </ImagePreview>
        </Card>
      </ContentRow>
    </Wrapper>
  );
};

export default CreateProduct;

/* ================= STYLES ================= */
const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  min-height: calc(100vh - 4rem);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  background: #1e293b;
  color: #f8fafc;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #0f172a;
  }
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== CARD ===== */
const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

/* ===== FORM ===== */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;

  /* Hide number input arrows */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const inputBase = `
  padding: 8px 10px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  transition: border 0.15s;

  &:focus {
    border-color: #93c5fd;
    background: #fff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const StyledInput = styled.input`
  ${inputBase}
`;

const StyledSelect = styled.select`
  ${inputBase}
  color: ${(p) => (p.value === "" ? "#94a3b8" : "#0f172a")};
  cursor: pointer;
`;

const FileInput = styled.input`
  font-size: 13px;
  color: #475569;
  cursor: pointer;

  &::file-selector-button {
    height: 28px;
    padding: 0 10px;
    margin-right: 10px;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #e2e8f0;
    }
  }
`;

const ErrorText = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #a32d2d;
  margin: 2px 0 0;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 16px;
  margin-top: auto;
  background: #1e293b;
  color: #f8fafc;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #0f172a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ===== IMAGE PREVIEW ===== */
const ImagePreview = styled.div`
  flex: 1;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  background: #f8fafc;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
  }
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;

  p {
    font-size: 13px;
    font-weight: 500;
    margin: 0;
    text-align: center;
  }
`;

const PlaceholderIcon = styled.span`
  font-size: 32px;
  opacity: 0.4;
`;
