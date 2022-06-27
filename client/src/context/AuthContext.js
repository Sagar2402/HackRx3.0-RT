import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";
import { TOKEN_ID, ADMIN_TOKEN_ID, REFRESH_TOKEN_ID } from "../utils/constants";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [adminPayment, setadminPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const restoreUser = async () => {
    const token = localStorage.getItem(REFRESH_TOKEN_ID);
    if (token) {
      try {
        const res = await axios.get("/users/get/" + token);
        console.log(res);
        if (res.status == 200) {
          setUser(res.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  };
  const restoreAdmin = async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_ID);
    if (token) {
      try {
        const res = await axios.get("/api/admin/getadmin", {
          headers: {
            authorization: token,
          },
        });
        console.log(res.data.data.role.accessLevel);
        if (res.data.success) {
          setAdmin(res.data.data);
          setLoading(false);
          if (res.data.data.role.accessLevel === 3) {
            console.log(res.data);
            setadminPayment(res.data.data);
            console.log(adminPayment);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    const admintoken = localStorage.getItem(ADMIN_TOKEN_ID);
    const usertoken = localStorage.getItem(TOKEN_ID);
    if (usertoken) restoreUser();
    if (admintoken) restoreAdmin();
  }, []);
  // method to handle user registration
  const userRegister = async (
    name,
    email,
    password,
    phone,
    gender,
    referral
  ) => {
    try {
      let data = {
        name,
        email,
        password,
        phone,
        gender,
      };
      data =
        referral == null || referral.length < 3
          ? data
          : { ...data, referralCode: referral };
      const res = await axios.post("/auth/register", data);
      if (!res.data == 201) return res.data;
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  // method to handle user login
  const userLogin = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      if (!res.data.code == 200) return res.data;
      localStorage.setItem(TOKEN_ID, res.data.tokens.access.token);
      localStorage.setItem(REFRESH_TOKEN_ID, res.data.tokens.refresh.token);
      restoreUser();
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  // method to handle admin login
  const resendVerif = async (email, password) => {
    try {
      const res = await axios.post("/api/user/resendlink", {
        email,
      });
      if (!res.data.success) return res.data;
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  // method to handle admin login
  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post("/api/admin/login", {
        email,
        password,
      });
      if (!res.data.success) return res.data;
      localStorage.setItem(ADMIN_TOKEN_ID, res.data.data.token);
      restoreAdmin();
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  // method to handle user logout
  const logout = async () => {
    try {
      const token = localStorage.getItem(REFRESH_TOKEN_ID);
      setUser(null);
      localStorage.removeItem(TOKEN_ID);
      localStorage.removeItem(REFRESH_TOKEN_ID);
      navigate("/");
      await axios.post("/auth/logout", { refreshToken: token });
    } catch (err) {
      throw err;
    }
  };
  // method to handle admin logout
  const adminlogout = async () => {
    try {
      console.log("admin logout");
      setAdmin(null);
      setadminPayment(null);
      localStorage.removeItem(ADMIN_TOKEN_ID);
      navigate("/admin");
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user: user,
    admin: admin,
    userRegister: userRegister,
    userLogout: logout,
    userLogin: userLogin,
    adminLogin: adminLogin,
    adminLogout: adminlogout,
    resendVerif: resendVerif,
    adminPayment: adminPayment,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
