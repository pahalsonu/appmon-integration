import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary border-0 mb-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with Credentials</small>
            </div>
            <form>
              <div className="form-group mb-3">
                <div className="input-group input-group-merge input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ni ni-email-83"></i>
                    </span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Email"
                    type="email"
                  />
                </div>
              </div>
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
                  />
                </div>
              </div>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label className="custom-control-label" htmlFor=" customCheckLogin">
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary my-4">
                  Sign in
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
        <Row className="mt-3">
            <Col lg="6" mg="6">
                <Link to="./forgotPassword" className="text-light"><small>Forgot password?</small></Link>
            </Col>
            <Col lg="6" mg="6" className="text-right">
                <Link to="./register" className="text-light"><small>Create new account</small></Link>
            </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;