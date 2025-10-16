import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Github as GitHub, Twitter, Camera, } from "lucide-react";
import axios from "axios"; // Ensure axios is imported
import { useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import { useAuth } from "../contexts/useAuth";
import {
  FormContainer,
  FormHeader,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  Button,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  PasswordWrapper,
  PasswordToggle,
  Divider,
  SwitchText,
  SocialButton,
  SocialButtonsContainer,
} from "../components/FormElements";

import Logo from "../components/Logo";
import PasswordStrengthMeter from "../components/PasswordStrength";
import AuthBackground from "../components/AuthBackground";
import ThemeToggle from "../components/ThemeToggle";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
`;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#FFC107"
    />
    <path
      d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
      fill="#FF3D00"
    />
    <path
      d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
      fill="#4CAF50"
    />
    <path
      d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#1976D2"
    />
  </svg>
);

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Updated to use new local backend
  const API_BASE_URL = "http://localhost:5000";

  const toggleAuthMode = () => {
    console.log('Toggling auth mode from', isLogin ? 'login' : 'register', 'to', !isLogin ? 'login' : 'register');
    setIsLogin(!isLogin);
    setErrors({});
    setForm({
      name: "",
      email: "",
      password: "",
      profilePhoto: "",
      rememberMe: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8 && !isLogin) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Profile photo is optional for registration
    // if (!isLogin && !form.profilePhoto) {
    //   newErrors.profilePhoto = "Profile photo is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOAuthLogin = (provider) => {
    console.log('OAuth login initiated for:', provider);
    // Updated to use new local backend
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, isLogin:', isLogin);
    console.log('Form data:', { email: form.email, hasPassword: !!form.password });
    
    if (!validateForm()) {
      console.log('Validation failed, errors:', errors);
      return;
    }

    console.log('Validation passed, sending request...');

    try {
      setLoading(true);
      
      if (isLogin) {
        // Login - send JSON
        const endpoint = `${API_BASE_URL}/api/auth/login`;
        console.log('Sending login request to:', endpoint);
        
        const response = await axios.post(endpoint, {
          email: form.email,
          password: form.password,
        }, {
          headers: { "Content-Type": "application/json" },
        });

        console.log('Login successful, token received');
        localStorage.setItem("token", response.data.token);
        login(response.data.token);
        navigate("/");
      } else {
        // Register - send FormData for file upload
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        if (form.profilePhoto) formData.append("profilePhoto", form.profilePhoto);

        const endpoint = `${API_BASE_URL}/api/auth/register`;
        console.log('Sending register request to:', endpoint);
        
        const response = await axios.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log('Registration successful, token received');
        localStorage.setItem("token", response.data.token);
        login(response.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Auth error:", err);
      console.error("Error response:", err.response?.data);
      setErrors({ api: err.response?.data?.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <PageContainer>
      <span style={{ position: "absolute", zIndex: "10", top: "3rem", right: "4rem" }}>
        <ThemeToggle />
      </span>
      <AuthBackground />
      <AnimatePresence mode="wait">
        <FormContainer
          key={isLogin ? "login" : "signup"}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={formVariants}
        >
          <FormHeader>
            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Logo />
            </motion.div>
            <Title>{isLogin ? "Welcome back" : "Join the community"}</Title>
            <Subtitle>
              {isLogin
                ? "Sign in to access your GDG account"
                : "Create an account to join Google Developer Groups"}
            </Subtitle>
          </FormHeader>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <FormGroup>
                <Label hasError={!!errors.name}>Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  hasError={!!errors.name}
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>
            )}
            <FormGroup>
              <Label hasError={!!errors.email}>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                hasError={!!errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label hasError={!!errors.password}>Password</Label>
              <PasswordWrapper >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={form.password}
                  onChange={handleChange}
                  hasError={!!errors.password}
                  style={{
                    width: "100%",
                  }}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggle>
              </PasswordWrapper>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              {!isLogin && form.password && <PasswordStrengthMeter password={form.password} />}
              {!isLogin && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    gap: "0.2rem",
                    border: "2px solid #c9c5c5",
                    borderRadius: "0.2rem",
                    marginTop: "1em"
                  }}
                >
                  <Label
                    htmlFor="file-input"
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Camera />
                    <span>Upload Your Profile Photo</span>
                  </Label>
                  <Input
                    id="file-input"
                    type="file"
                    name="profilePhoto"
                    onChange={handleChange}
                  />
                  {errors.profilePhoto && <ErrorMessage>{errors.profilePhoto}</ErrorMessage>}
                </div>
              )}
            </FormGroup>
            {isLogin && (
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
              </CheckboxContainer>
            )}
            {errors.api && (
              <ErrorMessage style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {errors.api}
              </ErrorMessage>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
            <Divider>
              <span>or continue with</span>
            </Divider>
            <SocialButtonsContainer>
              <SocialButton 
                type="button" 
                onClick={() => handleOAuthLogin("google")}
              >
                <GoogleIcon />
                <span>Google</span>
              </SocialButton>
              <SocialButton 
                type="button" 
                onClick={() => handleOAuthLogin("github")}
              >
                <GitHub size={18} />
                <span>GitHub</span>
              </SocialButton>
              <SocialButton 
                type="button" 
                onClick={() => handleOAuthLogin("twitter")}
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </SocialButton>
            </SocialButtonsContainer>
            <SwitchText>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <a 
                onClick={toggleAuthMode}
                style={{ cursor: 'pointer' }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </a>
            </SwitchText>
          </Form>
        </FormContainer>
      </AnimatePresence>
    </PageContainer>
  );
};

export default AuthPage;
