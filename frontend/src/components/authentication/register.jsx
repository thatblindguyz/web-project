import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/authSlice";
import { StyledForm } from "./StyledForm";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* Redirect after register */

  useEffect(() => {
    if (auth._id) {
      navigate("/cart");
    }
  }, [auth._id, navigate]);

  /* Show error */

  useEffect(() => {
    if (auth.registerStatus === "rejected") {
      toast.error(auth.registerError);
    }
  }, [auth.registerStatus, auth.registerError]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(user));
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="name"
        value={user.name}
        onChange={(e) =>
          setUser({
            ...user,
            name: e.target.value,
          })
        }
      />

      <input
        type="email"
        placeholder="email"
        value={user.email}
        onChange={(e) =>
          setUser({
            ...user,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="password"
        value={user.password}
        onChange={(e) =>
          setUser({
            ...user,
            password: e.target.value,
          })
        }
      />

      <button disabled={auth.registerStatus === "pending"}>
        {auth.registerStatus === "pending" ? "Submitting..." : "Register"}
      </button>

      {auth.registerStatus === "rejected" ? <p>{auth.registerError}</p> : null}
    </StyledForm>
  );
};

export default Register;
