// src/pages/AuthCallback.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import styled from "styled-components";
import { API_BASE_URL } from "../config/api";

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const redirect = params.get("redirect") || "/";

    if (error) {
      setMessage("Authentication failed. Redirecting...");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
      return;
    }

    if (token) {
      // Store token and complete login
      localStorage.setItem("token", token);
      login(token);
      setMessage("Success! Redirecting...");
      setTimeout(() => {
        navigate(redirect);
      }, 800);
    } else {
      setMessage("No authentication token received. Redirecting...");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
  }, [login, navigate]);

  return (
    <LoadingContainer>
      <Spinner />
      <Message>{message}</Message>
    </LoadingContainer>
  );
};

export default AuthCallback;
