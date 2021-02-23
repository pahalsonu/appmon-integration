import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components

import ProfileImg from "../../assets/img/theme/team-1-800x800.jpg";

class Profile extends React.Component {
  state = {
    showPhoneVerification: false,
    showEmailVerification: false,
    showDeleteAccount: false,
    showUpdatePassword: false,
  };
  toggle = (modal) => this.setState({ [modal]: !this.state[modal] });

  cursorStyle = {
    cursor: "pointer",
  };

  render() {
    return (
      <>
        {/* Verify Phone number  */}
        <Modal
          isOpen={this.state.showPhoneVerification}
          toggle={() => {
            this.toggle("showPhoneVerification");
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              this.toggle("showPhoneVerification");
            }}
          >
            Verify Mobile Number
          </ModalHeader>
          <ModalBody>
            <form>
              <h4 class="heading-medium mb-4 text-center">
                We have sent you an OTP
              </h4>
              <h6 class="form-control-label mb-4 text-center text-muted">
                Please Enter the Code below
              </h6>
              <div class="pl-lg-4 mx-auto w-50">
                <div class="row mx-auto">
                  <div class="form-group">
                    <input
                      type="number"
                      id="number1"
                      class="form-control"
                      name="number1"
                    />
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => this.toggle("showPhoneVerification")}
            >
              Close
            </Button>{" "}
            <Button
              color="primary"
              onClick={() => this.toggle("showPhoneVerification")}
            >
              <span class="btn-inner--icon">
                <i class="ni ni-bag-17"></i>
              </span>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
        {/* Email Verification */}
        <Modal
          isOpen={this.state.showEmailVerification}
          toggle={() => {
            this.toggle("showEmailVerification");
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              this.toggle("showEmailVerification");
            }}
          >
            Verify Email Address
          </ModalHeader>
          <ModalBody>
            <form>
              <h4 class="heading-medium mb-4 text-center">
                We have sent you an code to your Email
              </h4>
              <h6 class="form-control-label mb-4 text-center text-muted">
                Please Enter the Code below
              </h6>
              <div class="pl-lg-4 mx-auto w-50">
                <div class="row mx-auto">
                  <div class="form-group">
                    <input
                      type="number"
                      id="number1"
                      class="form-control"
                      name="number1"
                    />
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => this.toggle("showEmailVerification")}
            >
              Close
            </Button>{" "}
            <Button
              color="primary"
              onClick={() => this.toggle("showEmailVerification")}
            >
              <span class="btn-inner--icon">
                <i class="ni ni-bag-17"></i>
              </span>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
        {/* Update Password */}
        <Modal
          isOpen={this.state.showUpdatePassword}
          toggle={() => {
            this.toggle("showUpdatePassword");
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              this.toggle("showUpdatePassword");
            }}
          >
            Update Password
          </ModalHeader>
          <ModalBody>
            <form>
              <h6 class="heading-small text-muted mb-4">Current Details</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-10">
                    <div class="form-group">
                      <label class="form-control-label" for="currentPassword">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        class="form-control"
                        placeholder="Your Current Password"
                        name="currentPassword"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              {/* <!-- Address --> */}
              <h6 class="heading-small text-muted mb-4">Updated Details</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-10">
                    <div class="form-group">
                      <label class="form-control-label" for="newPassword">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        class="form-control"
                        placeholder="Your new Password"
                        name="newPassword"
                      />
                    </div>
                  </div>
                  <div class="col-lg-10">
                    <div class="form-group">
                      <label class="form-control-label" for="confirmPassword">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        class="form-control"
                        placeholder="Your confirm Password"
                        name="confirmPassword"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => this.toggle("showUpdatePassword")}
            >
              Close
            </Button>{" "}
            <Button
              color="primary"
              onClick={() => this.toggle("showUpdatePassword")}
            >
              <span class="btn-inner--icon">
                <i class="ni ni-bag-17"></i>
              </span>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
        {/* Delete Account */}
        <Modal
          isOpen={this.state.showDeleteAccount}
          toggle={() => {
            this.toggle("showDeleteAccount");
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              this.toggle("showDeleteAccount");
            }}
          >
            Delete Account
          </ModalHeader>
          <ModalBody>
            <form>
              <h6 class="heading-small text-muted mb-4">Details</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <label class="form-control-label" for="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        class="form-control"
                        placeholder="Your Current Password"
                        name="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <h6 class="heading-small text-muted mb-4">Consent</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <div class="custom-control custom-radio mb-3">
                        <input
                          type="checkbox"
                          id="customRadio1"
                          name="customRadio"
                          class="custom-control-input"
                        />
                        <label class="custom-control-label" for="customRadio1">
                          Allow Appmon to save your account details.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => this.toggle("showDeleteAccount")}
            >
              Close
            </Button>{" "}
            <Button
              color="primary"
              onClick={() => this.toggle("showDeleteAccount")}
            >
              <span class="btn-inner--icon">
                <i class="ni ni-bag-17"></i>
              </span>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={ProfileImg}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                      Jessica Jones
                      <span className="font-weight-light">, 27</span>
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Bucharest, Romania
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1 mb-4" xl="8">
              <Card className="card-profile shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Edit Profile</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="lucky.jesse"
                              id="input-username"
                              placeholder="Username"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="jesse@example.com"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-phone"
                            >
                              Phone Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="+91-999-999-9999"
                              id="input-phone"
                              type="text"
                            />
                          </FormGroup>
                          <p class="font-weight-300 form-control-label">
                            Status: <span class="text-danger">Unverified</span>{" "}
                            (
                            <span
                              className="text-muted"
                              style={this.cursorStyle}
                              onClick={() => {
                                this.toggle("showPhoneVerification");
                              }}
                            >
                              Click here to verify
                            </span>
                            )
                          </p>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="test@test.com"
                              id="input-email"
                              type="text"
                            />
                          </FormGroup>
                          <p class="font-weight-300 form-control-label">
                            Status: <span class="text-danger">Unverified</span>{" "}
                            (
                            <span
                              onClick={() => {
                                this.toggle("showEmailVerification");
                              }}
                              className="text-muted"
                              style={this.cursorStyle}
                            >
                              Click here to verify
                            </span>
                            )
                          </p>
                        </Col>
                      </Row>
                    </div>
                    <div class="text-center">
                      <Button type="submit" color="primary" value="Save">
                        Save
                      </Button>
                    </div>
                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">
                      Danger Zone
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Update Your Password
                            </label>
                            <p class="form-control-label">
                              <span
                                class="text-muted"
                                onClick={() => {
                                  this.toggle("showUpdatePassword");
                                }}
                                style={this.cursorStyle}
                              >
                                Click here to Update your Password
                              </span>
                            </p>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Delete Your Account
                            </label>
                            <p class="form-control-label">
                              <span
                                class="text-muted"
                                onClick={() => {
                                  this.toggle("showDeleteAccount");
                                }}
                                style={this.cursorStyle}
                              >
                                Click here to Delete your Account
                              </span>
                            </p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;