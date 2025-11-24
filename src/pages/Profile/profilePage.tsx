import React, { useEffect, useState } from "react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";
import { Card, Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import userProfileDefaultPicture from '../../images/userDefaultProfilePicture.png';

interface StudentProfile {
  studentFirstName: string;
  studentLastName: string;
  studentId: number;
  studentEmail: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  gender?: string;
  nationality?: string;
  phoneNo?: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeForm, setFeeForm] = useState<any>({});
  const [newPassword, setNewPassword] = useState(""); // For password update

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleFeeClose = () => setShowFeeModal(false);
  const handleFeeShow = () => setShowFeeModal(true);
  // populate fee form with defaults when opening
  const openFeeModal = () => {
    if (!profileData) {
      setShowFeeModal(true);
      return;
    }

    const defaults = {
      companyName: "School Management",
      siteLocation: "",
      contactPerson: "Accounts Department",
      contactNo: profileData.phoneNo || "",
      serialNo: "",
      invoiceNo: "",
      amount: "",
      dueDate: new Date().toISOString().slice(0, 10),
      studentFirstName: profileData.studentFirstName,
      studentLastName: profileData.studentLastName,
      studentEmail: profileData.studentEmail,
      studentId: profileData.studentId,
      deviceModel: "",
      visitFrequency: "",
      vehicleNumber: "",
      seatCapacity: "",
      visitDate: new Date().toISOString().slice(0, 10),
      customerRemarks: "",
      voucherRemarks: "",
    };

    setFeeForm(defaults);
    setShowFeeModal(true);
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payloadBase64 = token.split(".")[1];
        const decodedJson = JSON.parse(atob(payloadBase64));
        const userId = decodedJson?.nameid;

        if (!userId) return;

        const response = await fetch(`https://localhost:7072/api/Student/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (!profileData) return;
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const payloadBase64 = token.split(".")[1];
      const decodedJson = JSON.parse(atob(payloadBase64));
      const userId = decodedJson?.nameid;

      // Build payload including new password if provided
      const payload = {
        id: userId, // ensure backend ID matches URL
        studentFirstName: profileData.studentFirstName,
        studentLastName: profileData.studentLastName,
        studentId: profileData.studentId,
        studentEmail: profileData.studentEmail,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        city: profileData.city,
        gender: profileData.gender,
        nationality: profileData.nationality,
        phoneNo: profileData.phoneNo,
        ...(newPassword && { passwordHash: newPassword })
      };

      const response = await fetch(`https://localhost:7072/api/Student/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Update failed: ${response.status} ${text}`);
      }

      let updatedData: StudentProfile = profileData; // fallback
      // Only parse JSON if response has content
      if (response.status !== 204) {
        updatedData = await response.json();
      }

      setProfileData(updatedData); // update state
      handleClose();
      setNewPassword(""); // clear password input
      console.log("Profile updated successfully", updatedData);

    } catch (error: any) {
      console.error(error);
      alert("Failed to update profile: " + error.message);
    }
  };

  if (!profileData) return <div className="min-vh-100 d-flex justify-content-center align-items-center">Loading...</div>;

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column p-0 bg-white text-dark">
      <Header />
      <main className="flex-grow-1 py-4">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col md={6} lg={5}>
              <Card className="text-center shadow-sm border-2">
                <Card.Body>
                  <img src={userProfileDefaultPicture} alt="Profile" className="mb-4" width="100%" height="100%" />
                  <h2 className="fw-bold">{profileData.studentFirstName} {profileData.studentLastName}</h2>
                  <p className="text-muted mb-0 fw-bold">Student Email: {profileData.studentEmail}</p>
                  <p className="text-muted fw-bold">Student Phone No: {profileData.phoneNo || "-"}</p>
                  <br />
                  <Button variant="primary" onClick={handleShow}>✏️ Edit Profile</Button>
                  <br /><br />
                  <Button variant="primary" onClick={openFeeModal}>📄 Download Fee Voucher</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Personal Info */}
          <Row className="gy-4">
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="fw-semibold fs-5">Personal Information</Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    <li><strong>Full Name:</strong> {profileData.studentFirstName} {profileData.studentLastName}</li>
                    <li><strong>Student ID:</strong> {profileData.studentId}</li>
                    <li><strong>Email:</strong> {profileData.studentEmail}</li>
                    <li><strong>Date of Birth:</strong> {profileData.dateOfBirth || "-"}</li>
                    <li><strong>Phone:</strong> {profileData.phoneNo || "-"}</li>
                    <li><strong>Gender:</strong> {profileData.gender || "-"}</li>
                    {profileData.nationality && <li><strong>Nationality:</strong> {profileData.nationality}</li>}
                    {profileData.address && <li><strong>Address:</strong> {profileData.address}, {profileData.city}</li>}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="studentFirstName" value={profileData.studentFirstName} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="studentLastName" value={profileData.studentLastName} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Id</Form.Label>
                  <Form.Control type="text" name="studentId" value={profileData.studentId} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Email</Form.Label>
                  <Form.Control type="text" name="studentEmail" value={profileData.studentEmail} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date Of Birth</Form.Label>
                  <Form.Control type="text" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" name="address" value={profileData.address} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={profileData.city} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control type="text" name="gender" value={profileData.gender} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control type="text" name="nationality" value={profileData.nationality} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" value={newPassword} onChange={handlePasswordChange} placeholder="Enter new password" />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Fee Modal */}
      <Modal show={showFeeModal} onHide={handleFeeClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Fee Voucher</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control type="text" name="companyName" value={feeForm.companyName || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Site Location</Form.Label>
                  <Form.Control type="text" name="siteLocation" value={feeForm.siteLocation || ''} onChange={(e)=> setFeeForm({...feeForm, siteLocation: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control type="text" name="contactPerson" value={feeForm.contactPerson || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact No</Form.Label>
                  <Form.Control type="text" name="contactNo" value={feeForm.contactNo || ''} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Invoice No</Form.Label>
                  <Form.Control type="text" name="invoiceNo" value={feeForm.invoiceNo || ''} onChange={(e)=> setFeeForm({...feeForm, invoiceNo: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" name="amount" value={feeForm.amount || ''} onChange={(e)=> setFeeForm({...feeForm, amount: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" name="dueDate" value={feeForm.dueDate || ''} onChange={(e)=> setFeeForm({...feeForm, dueDate: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student First Name</Form.Label>
                  <Form.Control type="text" name="studentFirstName" value={feeForm.studentFirstName || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Last Name</Form.Label>
                  <Form.Control type="text" name="studentLastName" value={feeForm.studentLastName || ''} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Email</Form.Label>
                  <Form.Control type="email" name="studentEmail" value={feeForm.studentEmail || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Id</Form.Label>
                  <Form.Control type="text" name="studentId" value={feeForm.studentId || ''} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Remarks</Form.Label>
                  <Form.Control as="textarea" rows={2} name="customerRemarks" value={feeForm.customerRemarks || ''} onChange={(e)=> setFeeForm({...feeForm, customerRemarks: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Voucher Remarks</Form.Label>
                  <Form.Control as="textarea" rows={2} name="voucherRemarks" value={feeForm.voucherRemarks || ''} onChange={(e)=> setFeeForm({...feeForm, voucherRemarks: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleFeeClose}>Close</Button>
          <Button variant="primary" onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              const sendEmail = true;
              const toEmail = feeForm.studentEmail || '';
              const url = `https://localhost:7072/api/StudentFeeVoucher?sendEmail=${sendEmail}&toEmail=${encodeURIComponent(toEmail)}`;

              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(feeForm)
              });

              if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server error: ${response.status} ${text}`);
              }

              // Optionally get result or PDF link
              const result = await response.json().catch(()=>null);
              alert('Fee voucher requested successfully.');
              setShowFeeModal(false);
            } catch (err: any) {
              console.error(err);
              alert('Failed to generate voucher: ' + (err.message || err));
            }
          }}>Print</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePage;