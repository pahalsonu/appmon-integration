import React, { useState } from "react";
import { Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link } from "react-router-dom";
//set state
const Register = () => {

  const [name, setFullName] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    agree: false
  })

  const onChange = (e) => {
    const { name, value, checked } = e.target;
    setFullName((prevalue) => {
      if (name === "agree") {
        return {
          ...prevalue,
          [name]: checked
        }
      }
      return {
        ...prevalue,
        [name]: value,
      }
    })
  };



  const onSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <Col lg="7" md="7">
        <Card className="bg-secondary border-0 mb-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up by providing following details </small>
            </div>
            <Form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <div className="row ml-2">
                      <label className="labels">Account Type</label>
                      <div className="custom-control custom-radio ml-5">
                        <input
                          name="accountType"
                          className="custom-control-input"
                          id="individualRadio"
                          onChange={onChange}
                          value="individual"
                          type="radio"
                        />
                        <label className="custom-control-label" htmlFor="individualRadio">
                          Individual
                        </label>
                      </div>
                      <div className="custom-control custom-radio ml-5">
                        <input

                          className="custom-control-input"
                          id="organizationRadio"
                          name="accountType"
                          value="organization"
                          onChange={onChange}
                          type="radio"
                        />
                        <label className="custom-control-label" htmlFor="organizationRadio">
                          Organization
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="input-group input-group-merge input-group-alternative mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-hat-3"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                        value={name.firstName}
                        onChange={onChange}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="input-group input-group-merge input-group-alternative mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-hat-3"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Last Name"
                        type="text"
                        name="lastName"
                        value={name.lastName}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ni ni-email-83"></i>
                    </span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={name.email}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ni ni-mobile-button"></i>
                    </span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Mobile Number"
                    type="number"
                    name="mobileNumber"
                    value={name.mobileNumber}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="input-group input-group-merge input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-lock-circle-open"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={name.password}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="input-group input-group-merge input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-lock-circle-open"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={name.confirmPassword}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-muted font-italic">
                <small>
                  password strength:
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>
              <div className="row my-4">
                <div className="col-12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      name="agree"
                      value={name.agree}
                      onChange={onChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the
                        <a href="./Terms.html">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className="text-muted font-italic mb-2">
                <small>Optional: Enter a Url to begin monitoring </small>
              </div>
              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ni ni-mobile-button"></i>
                    </span>
                  </div>
                  <input className="form-control" placeholder="Url" type="text" />
                </div>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary mt-4">
                  Create account
                </button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col lg="6" mg="6">
            <Link to="./forgotPassword" className="text-light">
              <small>Forgot password?</small>
            </Link>
          </Col>
          <Col lg="6" mg="6" className="text-right">
            <Link to="./register" className="text-light">
              <small>Create new account</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Register;
