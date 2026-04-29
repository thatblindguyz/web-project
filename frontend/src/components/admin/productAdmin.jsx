import { useNavigate, Outlet } from "react-router-dom";
import styled from "styled-components";
import { AdminHeaders, PrimaryButton } from "./commonStyled";

const ProductAdmin = () => {
  const navigate = useNavigate();

  return (
    <StyledProducts>
      {/* Header */}
      <AdminHeaders>
        <h2>Products</h2>

        <PrimaryButton
          onClick={() => navigate("/admin/products/create-product")}
        >
          Create Product
        </PrimaryButton>
      </AdminHeaders>

      <Outlet />
    </StyledProducts>
  );
};

export default ProductAdmin;

/* ================= STYLES ================= */

const StyledProducts = styled.div`
  width: 100%;
`;
