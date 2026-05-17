import { useNavigate, useLocation, Outlet } from "react-router-dom";
import styled from "styled-components";
import { AdminHeaders, PrimaryButton } from "../common/commonStyled";

const ProductAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreating = location.pathname.includes("create-product");

  return (
    <StyledProducts>
      <AdminHeaders>
        <h2>Quản lý sản phẩm</h2>
        {!isCreating && (
          <PrimaryButton
            onClick={() => navigate("/admin/products/create-product")}
          >
            + Thêm sản phẩm
          </PrimaryButton>
        )}
      </AdminHeaders>
      <Outlet />
    </StyledProducts>
  );
};

export default ProductAdmin;

const StyledProducts = styled.div`
  width: 100%;
`;
