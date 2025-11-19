import React, { useState} from "react";
import type { SyntheticEvent, ChangeEvent } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Tabs, Tab } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

const API_BASE = "http://localhost:4400";

const ToDoHome: React.FC = () => {
  const [tab, setTab] = useState<string>("login");
  const [cookies, setCookie] = useCookies(["user_id"]);
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setFormData({ user_name: "", password: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleLogin = async () => {
    if (!formData.user_name || !formData.password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/users`);
      const user = res.data.find(
        (u: any) =>
          u.user_name.toLowerCase() === formData.user_name.toLowerCase() &&
          u.password === formData.password
      );

      if (user) {
        setCookie("user_id", user.user_id, { path: "/", maxAge: 86400 });
        alert(`Welcome, ${user.user_name}!`);
        navigate("/user-dashboard");
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  
  const handleRegister = async () => {
    if (!formData.user_name || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    
    const generatedUserId = `${formData.user_name.toLowerCase()}_${Math.floor(
      Math.random() * 1000
    )}`;

    const newUser = {
      user_id: generatedUserId,
      user_name: formData.user_name,
      password: formData.password,
    };

    try {
      await axios.post(`${API_BASE}/register-user`, newUser);
      alert(
        `Account created successfully! Your User ID is "${generatedUserId}". You can now log in.`
      );
      setTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") handleLogin();
    else handleRegister();
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 bg-white shadow-sm">
        <h4 className="fw-bold m-0 text-primary">
          <i className="bi bi-check2-circle me-2"></i>Task Manager
        </h4>
      </header>

      <Container
        fluid
        className="flex-grow-1 d-flex align-items-center justify-content-center py-5"
      >
        <Row className="w-75 align-items-center">
          <Col md={6} className="text-center">
            <h2 className="fw-bold mb-3 display-6">
              Organize Your Day, <br /> Achieve Your Goals
            </h2>
            <p className="text-muted mb-4">
              The simple, intuitive to-do list for modern professionals.
            </p>
            <Image src="todo.jpg" fluid rounded alt="To Do App" />
          </Col>

          <Col md={6} className="d-flex justify-content-center mt-4 mt-md-0">
            <Card className="shadow-sm p-4" style={{ width: "380px" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
                className="mb-3"
              >
                <Tab value="login" label="Log In" />
                <Tab value="signup" label="Sign Up" />
              </Tabs>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </Form.Group>

                <Button variant="primary" className="w-100 mb-3" type="submit">
                  {tab === "login" ? "Log In" : "Create Account"}
                </Button>

                <div className="text-center text-muted mb-3">
                  <small>OR</small>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="w-50">
                    <GoogleIcon className="me-2" /> Google
                  </Button>
                  <Button variant="outline-secondary" className="w-50">
                    <AppleIcon className="me-2" /> Apple
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="bg-white py-3 text-center border-top">
        <small className="text-muted">
          © 2025 Task Manager. All rights reserved. &nbsp; | &nbsp;
          <a href="#" className="text-decoration-none text-muted">
            Terms of Service
          </a>{" "}
          &nbsp; | &nbsp;
          <a href="#" className="text-decoration-none text-muted">
            Privacy Policy
          </a>
        </small>
      </footer>
    </div>
  );
};

export default ToDoHome;
