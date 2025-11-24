import React, { useState } from 'react';
import InputField from '../../components/input';
import Button from '../../components/button';
import Card from '../../components/card';
import AlertMessage from '../../components/alertMessage';
import Loader from '../../components/loader';
import { useNavigate } from 'react-router-dom';
import SchoolBackgroundImage from '../../images/kasbIns.jpg';

const RegisterUser: React.FC = () => {
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [otherGender, setOtherGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    if (
      !studentFirstName ||
      !studentLastName ||
      !studentId ||
      !studentEmail ||
      !dateOfBirth ||
      !address ||
      !city ||
      !gender ||
      !nationality ||
      !phoneNo ||
      !passwordHash ||
      !confirmPassword
    ) {
      setError('Please fill out all fields.');
      return false;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(studentEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!/^[0-9]+$/.test(studentId)) {
      setError('Student ID must be a number.');
      return false;
    }

    if (passwordHash !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    // If user selected Other, ensure they provided a custom gender value
    if (gender === 'Other' && !otherGender) {
      setError('Please specify your gender when selecting Other.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        studentFirstName,
        studentLastName,
        studentId: Number(studentId),
        studentEmail,
        dateOfBirth,
        address,
        city,
        gender: gender === 'Other' ? otherGender : gender,
        nationality,
        phoneNo,
        passwordHash,
      };

      const res = await fetch('https://localhost:7072/api/Student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(err.message || 'Registration failed');
      }

      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: form card */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100 m-6">
          <Card title="Register Student">
            {error && <AlertMessage type="danger" message={error} />}
            {successMsg && <AlertMessage type="success" message={successMsg} />}
            {loading ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <InputField
                      label="First Name"
                      value={studentFirstName}
                      onChange={(e) => setStudentFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputField
                      label="Last Name"
                      value={studentLastName}
                      onChange={(e) => setStudentLastName(e.target.value)}
                    />
                  </div>
                </div>

                <InputField label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                <InputField label="Email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />

                <div className="mb-3">
                  <label className="form-label fw-semibold">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <InputField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <InputField label="City" value={city} onChange={(e) => setCity(e.target.value)} />

                <div className="mb-3">
                  <label className="form-label fw-semibold">Gender</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {gender === 'Other' && (
                  <InputField
                    label="Please specify"
                    value={otherGender}
                    onChange={(e) => setOtherGender(e.target.value)}
                    placeholder="Describe your gender"
                  />
                )}

                <InputField label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                <InputField label="Phone No" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />

                <InputField
                  label="Password"
                  type="password"
                  value={passwordHash}
                  onChange={(e) => setPasswordHash(e.target.value)}
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="d-grid mt-3">
                  <Button label="Create Student" type="submit" variant="primary" />
                </div>
                <div className="d-grid mt-3">
                  <Button label="Cancel" type="button" variant="secondary" onClick={() => navigate('/login')} />
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      {/* Right: background image on md+ */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${SchoolBackgroundImage})`, minHeight: '100vh' }}
        aria-hidden
      />
    </div>
  );
};

export default RegisterUser;