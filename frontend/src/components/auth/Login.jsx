import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import { getTotals } from "../../features/cart/CartSlice";

/* ============================
   COMPONENT
============================ */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  /* Redirect after login */
  useEffect(() => {
    if (auth._id) {
      // dispatch(loadCart(auth._id));

      dispatch(getTotals());

      navigate("/");
    }
  }, [auth._id, navigate, dispatch]);

  useEffect(() => {
    if (auth.loginStatus === "rejected") {
      toast.error(auth.loginError);
    }
  }, [auth.loginStatus, auth.loginError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(user));
  };

  const isPending = auth.loginStatus === "pending";

  return (
    <Wrapper>
      <Card>
        {/* ICON */}
        <IconWrap>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </IconWrap>

        <Title>Welcome back</Title>
        <Sub>Sign in to your account</Sub>

        <Form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <FieldGroup>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              disabled={isPending}
            />
          </FieldGroup>

          {/* PASSWORD */}
          <FieldGroup>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputWrap>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
                disabled={isPending}
              />
              <EyeBtn
                type="button"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </EyeBtn>
            </InputWrap>
          </FieldGroup>

          {/* FORGOT PASSWORD */}
          <ForgotLink to="/forgot-password">Forgot password?</ForgotLink>

          {/* SUBMIT */}
          <SubmitBtn type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Login"}
          </SubmitBtn>
        </Form>

        {/* ERROR */}
        {auth.loginStatus === "rejected" && (
          <Alert>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {auth.loginError}
          </Alert>
        )}

        {/* REGISTER LINK */}
        <RegisterRow>
          Don't have an account?{" "}
          <RegisterLink to="/register">Sign up</RegisterLink>
        </RegisterRow>
      </Card>
    </Wrapper>
  );
};

export default Login;

/* ============================
   STYLES
============================ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  animation: ${fadeIn} 0.3s ease;
`;

const IconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  margin-bottom: 0.25rem;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const Sub = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

const Alert = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  height: 42px;
  width: 100%;
  padding: 0 40px 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
  background: ${(p) => (p.disabled ? "#f8fafc" : "#fff")};

  &:focus {
    border-color: #1d4ed8;
    box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #475569;
  }
`;

const ForgotLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: #1d4ed8;
  text-decoration: none;
  text-align: right;
  margin-top: -4px;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitBtn = styled.button`
  height: 44px;
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1e293b")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "#f8fafc")};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #0f172a;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const RegisterRow = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

const RegisterLink = styled(Link)`
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
