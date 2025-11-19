import React, { useState, useEffect} from "react";
import type { ChangeEvent } from "react"; 
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
} from "react-bootstrap";
import {
  Tabs,
  Tab,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  Delete,
  CalendarMonth,
  Dashboard,
  CheckBox,
  Settings,
  Logout,
  Add,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Appointment {
  appointment_id: number;
  title: string;
  description: string;
  date: string;
  user_id: string;
}

interface User {
  user_id: string;
  user_name: string;
  password: string;
}

const API_BASE = "http://localhost:4400";

const ToDoUserDashboard: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["user_id"]);
  const userId = cookies.user_id as string;

  const [tab, setTab] = useState("today");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [userName, setUserName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchUserDetails();
    fetchAppointments();
  }, [userId]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, tab]);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      const currentUser = res.data.find((u: User) => u.user_id === userId);
      if (currentUser) {
        setUserName(currentUser.user_name);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-appointments/${userId}`);
      setAppointments(res.data);
      setTimeout(() => filterAppointments(), 200);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.title || !newAppointment.date) {
      alert("Please fill in Title and Date.");
      return;
    }

    const newAppt: Appointment = {
      appointment_id: Date.now(),
      title: newAppointment.title,
      description: newAppointment.description,
      date: newAppointment.date,
      user_id: userId,
    };

    try {
      await axios.post(`${API_BASE}/add-appointment`, newAppt);
      setAppointments((prev) => [...prev, newAppt]);
      setShowModal(false);
      setNewAppointment({ title: "", description: "", date: "" });
    } catch (err) {
      console.error("Error adding appointment:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/delete-appointment/${id}`);
      setAppointments((prev) => prev.filter((a) => a.appointment_id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = () => {
    removeCookie("user_id", { path: "/" });
    navigate("/");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const filterAppointments = () => {
    const now = new Date();

    const filtered = appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      const apptDay = apptDate.toLocaleDateString();
      const todayDay = now.toLocaleDateString();

      const matchesSearch =
        appt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;

      if (tab === "today") {
        matchesTab = apptDay === todayDay;
      } else if (tab === "week") {
        const weekStart = new Date(now);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(now.getDate() - now.getDay() + 1);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        matchesTab = apptDate >= weekStart && apptDate <= weekEnd;
      } else if (tab === "month") {
        matchesTab =
          apptDate.getMonth() === now.getMonth() &&
          apptDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesTab;
    });

    setFilteredAppointments(filtered);
  };

  return (
    <Container fluid className="p-0 bg-light min-vh-100">
      <Row className="g-0">
        
        <Col
          md={2}
          className="bg-white d-flex flex-column justify-content-between shadow-sm p-3"
        >
          <div>
            <h5 className="fw-bold text-primary mb-4">Task Manager</h5>
            <ListGroup variant="flush">
              <ListGroup.Item active>
                <Dashboard fontSize="small" className="me-2" /> Dashboard
              </ListGroup.Item>
              <ListGroup.Item>
                <CalendarMonth fontSize="small" className="me-2" /> Calendar
              </ListGroup.Item>
              <ListGroup.Item>
                <CheckBox fontSize="small" className="me-2" /> Tasks
              </ListGroup.Item>
              <ListGroup.Item>
                <Settings fontSize="small" className="me-2" /> Settings
              </ListGroup.Item>
            </ListGroup>
          </div>

         
          <div className="text-center mt-4">
            <Card className="border-0 bg-light p-2">
              <Card.Body className="p-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
                  alt="User Avatar"
                  className="rounded-circle mb-2"
                  width="60"
                />
                <h6 className="fw-semibold mb-0">{userName || "User"}</h6>
                <small className="text-muted">{userId}</small>
              </Card.Body>
            </Card>
            <Button
              variant="outline-danger"
              size="sm"
              className="w-100 mt-3"
              onClick={handleLogout}
            >
              <Logout fontSize="small" className="me-1" /> Log out
            </Button>
          </div>
        </Col>

        
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">Welcome, {userName || "User"} 👋</h3>
              <p className="text-muted mb-0">
                Here’s what you have scheduled today.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={fetchAppointments}>
                <Refresh fontSize="small" className="me-2" /> Refresh
              </Button>
              <Button variant="primary" className="fw-semibold" onClick={() => setShowModal(true)}>
                <Add className="me-2" /> Add Appointment
              </Button>
            </div>
          </div>

          
          <Row className="align-items-center mb-3">
            <Col md={5}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by title or description"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Col>
            <Col md="auto">
              <Tabs value={tab} onChange={handleTabChange}>
                <Tab value="today" label="Today" />
                <Tab value="week" label="This Week" />
                <Tab value="month" label="This Month" />
              </Tabs>
            </Col>
          </Row>

          
          {filteredAppointments.map((appt) => (
            <Card key={appt.appointment_id} className="mb-3 shadow-sm border-0">
              <Card.Body className="d-flex justify-content-between">
                <div>
                  <h5>{appt.title}</h5>
                  <p className="text-muted mb-1">{appt.description}</p>
                  <small>{new Date(appt.date).toLocaleString()}</small>
                </div>
                <div>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(appt.appointment_id)}>
                    <Delete />
                  </IconButton>
                </div>
              </Card.Body>
            </Card>
          ))}

          {filteredAppointments.length === 0 && (
            <p className="text-center text-muted mt-5">
              No appointments match your filters.
            </p>
          )}
        </Col>
      </Row>

      
      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={newAppointment.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={2}
            value={newAppointment.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Date & Time"
            name="date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAppointment.date}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAppointment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ToDoUserDashboard;
