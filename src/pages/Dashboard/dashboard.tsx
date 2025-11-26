import React, { useEffect, useState } from "react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";
import { Card, Row, Col, Container } from "react-bootstrap";
import "../../index.css";
import DefaultUserProfile  from "../../images/userDefaultProfilePicture.png"
import "./dashboard.module.css";

const Dashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("Token missing in local storage");
          return;
        }

        // Decode JWT manually (since we’re not using jwt-decode package)
        const payloadBase64 = token.split(".")[1];
        const decodedJson = JSON.parse(atob(payloadBase64));
        const userId = decodedJson?.nameid; // Student’s DB ID

        if (!userId) {
          console.error("User ID not found in token");
          return;
        }

        const response = await fetch(`https://localhost:7072/api/Student/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch student data (Status: ${response.status})`);
        }

        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://localhost:7072/api/Notice/AllNoticeRecord", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch notices (Status: ${response.status})`);
        }

        const noticeData = await response.json();
        setNotices(noticeData);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchStudentData();
    fetchNotices();
  }, []);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0 bg-white text-dark">
      <Header />
      <main className="flex-grow-1 py-4">
        <Container>
          {/* Welcome Section */}
          <div className="text-center mb-4">
            <h1 className="fw-bold text-dark">Welcome To Student Portal</h1>
            <p className="text-muted">
              Here is your academic overview and latest updates.
            </p>
          </div>

          {/* Student Overview Card */}
          <Row className="justify-content-center mb-4">
            <Col md={6} lg={5}>
              <Card className="text-center shadow-sm border-2">
                <Card.Body>
                  <img
                    src= {DefaultUserProfile}
                    alt="Profile"
                    className="mb-4"
                    width="100%"
                    height="100%"
                  />
                  <h5 className="fw-bold mb-0">Student Full Name: {studentData?.studentFirstName + " " + studentData?.studentLastName || "loading....."}</h5>
                  <p className="text-muted mb-1">Roll No: {studentData?.studentId || "loading....."}</p>
                  <p className="text-muted mb-1">Student Email: {studentData?.studentEmail || "loading....."}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Access Section */}
          <h4 className="fw-bold mb-3 text-center">Quick Access</h4>
          <Row className="g-3 mb-4">
            {[
              { title: "My Subjects", icon: "📘" },
              { title: "Attendance", icon: "🧾" },
              { title: "Fee Details", icon: "💳" },
              { title: "Assignments", icon: "🧠" },
              { title: "Exams & Results", icon: "🧮" },
              { title: "Timetable", icon: "📅" },
              { title: "Announcements", icon: "📢" },
              { title: "Messages", icon: "✉️" },
            ].map((item, idx) => (
              <Col xs={6} md={3} key={idx}>
                <Card className="text-center h-100 border-0 shadow-sm card-hover">
                  <Card.Body>
                    <div className="fs-2 mb-2">{item.icon}</div>
                    <h6 className="fw-semibold">{item.title}</h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Notifications Section */}
          <h4 className="fw-bold mb-3 text-center">Recent Notifications</h4>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <ul className="list-group list-group-flush">
                    {notices.length > 0 ? (
                      notices.map((notice, idx) => (
                        <li key={idx} className="list-group-item">
                          📢 <strong>{notice.title}</strong> — {notice.description}
                          <br />
                          <small className="text-muted">
                            {new Date(notice.noticeDate).toLocaleDateString()}
                          </small>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted text-center">
                        No notifications available.
                      </li>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;