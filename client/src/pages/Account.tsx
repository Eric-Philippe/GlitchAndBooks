import { useEffect, useState } from "react";
import { isConnected } from "../middlewares/auth";
import Login from "./Login";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import {
  BoxArrowLeft,
  EnvelopeCheckFill,
  LockFill,
  PencilSquare,
  PersonCircle,
  Trash3Fill,
} from "react-bootstrap-icons";

import "./styles.css";

const Account = () => {
  const [isUserConnected, setIsUserConnected] = useState(false);

  const [showModalConfirmPass, setShowModalConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showModalChangePassword, setShowModalChangePassword] = useState(false);
  const [errorMsgChangePass, setErrorMsgChangePass] = useState("");
  const [successMsgChangePass, setSuccessMsgChangePass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const connected = (await isConnected()) as boolean;
        setIsUserConnected(connected);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const isRightPassword = async () => {
    const username = localStorage.getItem("username");

    const data = { username, password: passwordConfirm };

    try {
      const res = await fetch("/api/v1/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        setErrorMsg("Wrong password");
      } else {
        setShowModalConfirmPass(false);
        setErrorMsg("");
        setPasswordConfirm("");
        setShowModalChangePassword(true);
      }
    } catch (e) {
      setErrorMsg("Error while checking password");
    }
  };

  const changePassword = async () => {
    if (!newPass || !newPassConfirm) {
      setErrorMsgChangePass("Please fill all fields");
      return;
    }

    if (newPass !== newPassConfirm) {
      setErrorMsgChangePass("Passwords are not the same");
      return;
    }

    const userid = localStorage.getItem("userid");
    const sessionToken = localStorage.getItem("token");

    const data = { userid: userid, newPassword: newPass };

    const res = await fetch("/api/v1/account/password/change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      const response = await res.json();
      setErrorMsgChangePass(response.message);
    } else {
      setSuccessMsgChangePass("Password changed successfully");
      setErrorMsgChangePass("");

      setTimeout(() => {
        setShowModalChangePassword(false);
        setNewPass("");
        setNewPassConfirm("");
        setErrorMsgChangePass("");
        setSuccessMsgChangePass("");
      }, 2000);
    }
  };

  return (
    <>
      {isUserConnected === null ? (
        <div>
          <Header />
          <Loading />
        </div>
      ) : isUserConnected ? (
        <div>
          <Header />
          <div className="container text-center mt-4">
            <h1 className="display-6">My account</h1>
          </div>
          <div className="container text-center mt-3">
            <h3 className="display-7">Account information</h3>
          </div>
          <div
            className="container mt-4 d-flex justify-content-center align-items-center"
            id="center-container"
          >
            <Form className="account-form">
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <PersonCircle style={{ marginRight: 10 }} /> Username
                </InputGroup.Text>
                <Form.Control
                  value={localStorage.getItem("username") || ""}
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  <EnvelopeCheckFill style={{ marginRight: 10 }} /> Email
                </InputGroup.Text>
                <Form.Control
                  value={localStorage.getItem("mail") || ""}
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  <LockFill style={{ marginRight: 10 }} /> Password
                </InputGroup.Text>
                <Form.Control value="************" readOnly />
                <Button
                  variant="outline-light"
                  id="button-addon1"
                  onClick={() => setShowModalConfirmPass(true)}
                >
                  <PencilSquare style={{ marginRight: 10 }} /> Edit
                </Button>
              </InputGroup>
            </Form>
          </div>
          <div id="logout">
            <div className="container text-center mt-3">
              <h3 className="display-7">Logout</h3>
            </div>
            <div
              className="container mt-4 d-flex justify-content-center align-items-center"
              id="center-container"
            >
              <Button
                variant="outline-danger"
                className="account-long-red-button"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("mail");
                  window.location.reload();
                }}
              >
                <BoxArrowLeft style={{ marginRight: 4 }} /> Logout
              </Button>
            </div>
          </div>

          <div id="delaccount">
            <div className="container text-center mt-3">
              <h3 className="display-7">Delete my account</h3>
            </div>
            <div
              className="container mt-4 d-flex justify-content-center align-items-center"
              id="center-container"
            >
              <Button
                variant="danger"
                className="account-long-red-button"
                disabled
              >
                <Trash3Fill style={{ marginRight: 4 }} /> Delete my account
              </Button>
            </div>
          </div>

          <Modal
            show={showModalConfirmPass}
            onHide={() => {
              setShowModalConfirmPass(false);
              setErrorMsg("");
              setPasswordConfirm("");
            }}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Change password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <div
                    id="error-msg"
                    className={
                      errorMsg
                        ? "alert alert-danger"
                        : "alert alert-danger d-none"
                    }
                  >
                    {errorMsg && <p>{errorMsg}</p>}
                  </div>
                  <Form.Label>Enter your current password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModalConfirmPass(false);
                  setErrorMsg("");
                  setPasswordConfirm("");
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  isRightPassword();
                }}
              >
                Enter
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModalChangePassword}
            onHide={() => {
              setShowModalChangePassword(false);
              setNewPass("");
              setNewPassConfirm("");
              setErrorMsgChangePass("");
              setSuccessMsgChangePass("");
            }}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Change password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <div
                    id="error-msg"
                    className={
                      errorMsgChangePass
                        ? "alert alert-danger"
                        : "alert alert-danger d-none"
                    }
                  >
                    {errorMsgChangePass && <p>{errorMsgChangePass}</p>}
                  </div>
                  <div
                    id="success-msg"
                    className={
                      successMsgChangePass
                        ? "alert alert-success"
                        : "alert alert-success d-none"
                    }
                  >
                    {successMsgChangePass && <p>{successMsgChangePass}</p>}
                  </div>
                  <Form.Label>Enter your new password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="New password"
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Repeat your new password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat new password"
                    onChange={(e) => setNewPassConfirm(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModalChangePassword(false);
                  setNewPass("");
                  setNewPassConfirm("");
                  setErrorMsgChangePass("");
                  setSuccessMsgChangePass("");
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  changePassword();
                }}
              >
                Enter
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Account;
