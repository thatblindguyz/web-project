import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createProducts } from "../../../features/product/ProductSlice";
import { useGetProductsQuery } from "../../../features/product/ProductAPI";

/* ============================
   COMPONENT
============================ */
const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, createError } = useSelector((state) => state.products);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState(""); // FULL DESC
  const [shortDesc, setShortDesc] = useState(""); // ⭐ NEW
  const [priceError, setPriceError] = useState("");
  const [codeError, setCodeError] = useState("");
  const { data: existingProducts } = useGetProductsQuery();
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  /* ================= IMAGE UPLOAD ================= */
  const handleProductImageUpload = async (e) => {
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

  // const TransformFileData = (file) => {
  //   const reader = new FileReader();
  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => setProductImg(reader.result);
  //   } else {
  //     setProductImg("");
  //   }
  // };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra giá
    if (!price || price <= 0) {
      setPriceError("Giá phải lớn hơn 0");
      return;
    }
    setPriceError("");

    // 2. Kiểm tra trùng mã (client-side)
    const isDuplicate = existingProducts?.some(
      (p) => p.code.trim().toLowerCase() === code.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setCodeError("Mã sản phẩm đã tồn tại");
      return;
    }
    setCodeError("");

    // 3. Dispatch
    const result = await dispatch(
      createProducts({
        code,
        name,
        category,
        price,
        shortDesc,
        desc,
        quantity,
        image: productImages[selectedImage],
        images: productImages,
      }),
    );

    // Chỉ navigate khi thành công
    if (result.meta.requestStatus === "fulfilled") {
      setName("");
      setCode("");
      setCategory("");
      setPrice("");
      setDesc("");
      setShortDesc("");
      setProductImages([]);
      setQuantity("");
      navigate("/admin/products");
    }
  };

  /* ================= UI ================= */
  return (
    <Wrapper>
      <Header>
        <Left>
          <BackButton onClick={() => navigate(-1)}>← Quay lại</BackButton>
          <PageTitle>Tạo sản phẩm mới</PageTitle>
        </Left>
      </Header>

      <ContentRow>
        <Card>
          <CardTitle>Thông tin sản phẩm</CardTitle>

          <StyledForm onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <FieldLabel>Ảnh sản phẩm</FieldLabel>
              <FileInput
                accept="image/*"
                type="file"
                multiple
                onChange={handleProductImageUpload}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Danh mục</FieldLabel>
              <StyledSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Chọn danh mục
                </option>
                <option value="GPU">GPU</option>
                <option value="RAM">RAM</option>
                <option value="CPU">CPU</option>
                <option value="Monitor">Monitor</option>
              </StyledSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Mã sản phẩm</FieldLabel>
              <StyledInput
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCodeError("");
                }}
                required
              />
              {codeError && <ErrorText>{codeError}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Tên sản phẩm</FieldLabel>
              <StyledInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Giá (₫)</FieldLabel>
              <StyledInput
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (e.target.value > 0) setPriceError("");
                }}
                required
              />
              {priceError && <ErrorText>{priceError}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Số lượng</FieldLabel>
              <StyledInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </FieldGroup>

            {/* SHORT DESC */}
            <FieldGroup>
              <FieldLabel>Mô tả ngắn gọn</FieldLabel>
              <StyledInput
                type="text"
                placeholder="Mô tả ngắn gọn của sản phẩm...."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                required
              />
            </FieldGroup>

            {/* FULL DESC */}
            <FieldGroup>
              <FieldLabel>Mô tả chi tiết</FieldLabel>
              <StyledTextarea
                rows={6}
                placeholder="Mô tả chi tiết của sản phẩm...."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </FieldGroup>
            {createStatus === "rejected" && createError && (
              <ErrorText style={{ textAlign: "center" }}>
                {createError}
              </ErrorText>
            )}
            <SubmitButton type="submit" disabled={createStatus === "pending"}>
              {createStatus === "pending" ? "Đang thêm..." : "Thêm sản phẩm"}
            </SubmitButton>
          </StyledForm>
        </Card>

        <Card>
          <CardTitle>Ảnh sản phẩm</CardTitle>
          <ImagePreview>
            {productImages.length > 0 ? (
              <>
                {/* ẢNH LỚN PREVIEW */}
                <MainPreview>
                  <img src={productImages[selectedImage]} alt="preview" />
                </MainPreview>

                {/* THUMBNAIL GRID */}
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
              </>
            ) : (
              <Placeholder>
                <PlaceholderIcon>🖼</PlaceholderIcon>
                <p>Tải ảnh lên để xem trước</p>
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

const StyledTextarea = styled.textarea`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  resize: vertical;
`;

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
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  background: #f8fafc;
  padding: 12px;
  overflow: hidden;
`;

const MainPreview = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;

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

const PreviewGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));

  gap: 10px;

  width: 100%;

  img {
    width: 100%;
    height: 100px;

    object-fit: cover;

    border-radius: 8px;

    border: 1px solid #e2e8f0;
  }
`;

const PreviewItem = styled.div`
  position: relative;

  border-radius: 8px;

  overflow: hidden;

  cursor: pointer;

  border: 2px solid ${(p) => (p.$active ? "#2563eb" : "#e2e8f0")};

  img {
    width: 100%;
    height: 100px;

    object-fit: cover;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;

  bottom: 6px;
  left: 6px;

  background: #2563eb;

  color: white;

  font-size: 11px;
  font-weight: 600;

  padding: 3px 6px;

  border-radius: 4px;
`;
