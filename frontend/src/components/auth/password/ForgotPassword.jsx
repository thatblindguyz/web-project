import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { url } from "../../../features/api";

/* ============================
   COMPONENT
============================ */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${url}/forgot-password`, {
        email,
      });
      setStatus("success");
      setMessage("Reset link sent! Please check your email.");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </IconWrap>

        <Title>Forgot Password</Title>
        <Sub>Enter your email and we'll send you a reset link.</Sub>

        {status && (
          <Alert $type={status}>
            {status === "success" ? (
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
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
            )}
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "success"}
            />
          </FieldGroup>

          <SubmitBtn type="submit" disabled={loading || status === "success"}>
            {loading ? <Spinner /> : "Send Reset Link"}
          </SubmitBtn>
        </Form>

        <BackLink to="/login">← Back to Login</BackLink>
      </Card>
    </Wrapper>
  );
};

export default ForgotPassword;

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
  text-align: center;
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
  background: ${(p) => (p.$type === "success" ? "#f0fdf4" : "#fef2f2")};
  color: ${(p) => (p.$type === "success" ? "#16a34a" : "#dc2626")};
  border: 1px solid ${(p) => (p.$type === "success" ? "#bbf7d0" : "#fecaca")};
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

const Input = styled.input`
  height: 42px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  outline: none;
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

const BackLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  margin-top: 0.25rem;

  &:hover {
    color: #1e293b;
    text-decoration: underline;
  }
`;
