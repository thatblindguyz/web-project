import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./commonStyled";
import { createProducts } from "../../features/productSlice";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { createStatus } = useSelector((state) => state.products);

  const [productImg, setProductImg] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [priceError, setPriceError] = useState("");

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate price
    if (!price || price <= 0) {
      setPriceError("Price must be greater than 0");
      return;
    }

    // if valid
    setPriceError("");

    dispatch(
      createProducts({
        name,
        category,
        price,
        desc,
        image: productImg,
      }),
    );

    // reset form
    setName("");
    setCategory("");
    setPrice("");
    setDesc("");
    setProductImg("");
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit} noValidate>
        <h3>Create a Product</h3>

        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductImageUpload}
          required
        />

        <select
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
        </select>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* PRICE INPUT */}
        <div>
          <input
            type="number"
            placeholder="Price"
            value={price}
            step="0.01"
            onChange={(e) => {
              setPrice(e.target.value);

              if (e.target.value > 0) {
                setPriceError("");
              }
            }}
            required
          />

          {priceError && <ErrorText>{priceError}</ErrorText>}
        </div>

        <input
          type="text"
          placeholder="Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />

        <PrimaryButton type="submit" disabled={createStatus === "pending"}>
          {createStatus === "pending" ? "Submitting..." : "Submit"}
        </PrimaryButton>
      </StyledForm>

      <ImagePreview>
        {productImg ? (
          <img src={productImg} alt="preview" />
        ) : (
          <p>Product image upload preview will appear here!</p>
        )}
      </ImagePreview>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

/* ================= STYLES ================= */

const StyledCreateProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }

  /* ✅ Ẩn nút ↑ ↓ của number input */

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 3px;
`;
