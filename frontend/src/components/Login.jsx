import { useState } from "react";
// Import dari react-bootstrap yang masih dipakai (Form, Button)
import { Form, Button } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { axiosInstance } from "../auth/AxiosConfig.jsx";
// Import styled-components dan keyframes untuk animasi
import styled, { keyframes } from "styled-components";
// --- Styled Components ---

// Animasi fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Wrapper utama untuk seluruh halaman, menempatkan konten di tengah
const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
`;

// Card untuk form login
const StyledCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  animation: ${fadeIn} 0.7s ease-out;
`;

// Wrapper untuk Logo
const LogoWrapper = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  img {
    width: 100px; // Anda bisa sesuaikan ukuran logo
    height: auto;
    margin-bottom: 0.5rem;
  }

  h4 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
  }
`;

// Mengganti Form.Group untuk layout yang lebih baik
const FormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;

  label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
    display: block;
  }
`;

// Input field yang sudah di-style
const StyledInput = styled(Form.Control)`
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

// Tombol login
const StyledButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

// --- Komponen Login ---

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Fungsi handleSubmit tetap sama persis
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        userName,
        password,
      });
      if (response.data) {
        secureLocalStorage.setItem("acessToken", response.data.acessToken);
        secureLocalStorage.setItem("refreshToken", response.data.refreshToken);
        secureLocalStorage.setItem("user", response.data.result);
        toast.success(response.data.message, {
          position: "top-center",
        });
        
        // 3. GUNAKAN 'window.location.href' UNTUK MENCEGAH LOGIN LOOP
        window.location.href = "/"; // <-- Ini adalah kode yang benar
      }
    } catch (error) {
      // Ini adalah blok 'catch' yang sudah kita perbaiki
      let message = "Terjadi kesalahan. Coba lagi nanti."; 
      if (error.response) {
        message = error.response.data.message || message;
      } 
      else if (error.request) {
        message = "Tidak dapat terhubung ke server. Cek koneksi Anda.";
      } 
      else {
        message = error.message;
      }
      toast.error(message, {
        position: "top-center",
      });
    }
  };

  return (
    <LoginWrapper>
      <StyledCard>
        <LogoWrapper>
          {/* GANTI 'logo.svg' DENGAN PATH LOGO ANDA */}
          <img src="/img/Logo.jpg" alt="Logo Perusahaan" />
          <h4>Selamat Datang</h4>
        </LogoWrapper>
        
        {/* Form menggunakan Form dari react-bootstrap, tapi di-layout dengan styled-components */}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Form.Label>Username</Form.Label>
            <StyledInput
              type="text"
              placeholder="Masukkan username Anda"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Form.Label>Password</Form.Label>
            <StyledInput
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup className="mt-4">
            <StyledButton variant="primary" type="submit">
              Login
            </StyledButton>
          </FormGroup>
        </Form>
      </StyledCard>
    </LoginWrapper>
  );
};

export default Login;