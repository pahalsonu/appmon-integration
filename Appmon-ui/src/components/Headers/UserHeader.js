import React, { Component } from "react";

import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

class UserHeader extends Component {
  state = {
    showModal: false,
  };

  toggle = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  render() {
    const { checkType } = this.props;
    return (
      <div className="header bg-gradient-primary pb-8 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-end py-4">
              <Col xs="6" lg="6"></Col>
              {checkType === "new" && (
                <>
                  <Col xs="6" lg="6" className="text-right">
                    <Button
                      className="btn-md btn-neutral"
                      onClick={this.toggle}
                    >
                      New Checks
                    </Button>
                  </Col>
                  <Modal
                    isOpen={this.state.showModal}
                    toggle={this.toggle}
                    centered
                  >
                    <ModalHeader toggle={this.toggle}>
                      <h3 class="modal-title" id="newCheckModalLabel">
                        Create Check
                      </h3>
                    </ModalHeader>
                    <ModalBody>
                      <form>
                        <h6 class="heading-small text-muted mb-4">
                          General information
                        </h6>
                        <div class="pl-lg-4">
                          <div class="row">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-name"
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id="input-name"
                                  class="form-control"
                                  placeholder="Check Name"
                                  name="name"
                                />
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-url"
                                >
                                  URL
                                </label>
                                <input
                                  type="text"
                                  id="input-url"
                                  class="form-control"
                                  placeholder="Your service's URL"
                                  name="url"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr class="my-4" />
                        {/* <!-- Address --> */}
                        <h6 class="heading-small text-muted mb-4">
                          Check Details
                        </h6>
                        <div class="pl-lg-4">
                          <div class="row">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-success-codes"
                                >
                                  Success Codes
                                </label>
                                <input
                                  type="text"
                                  id="input-success-codes"
                                  class="form-control"
                                  placeholder="Saperated by Comma (200, 201, 202)"
                                  name="successCodes"
                                />
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-timeout"
                                >
                                  Timeout (s)
                                </label>
                                <input
                                  type="number"
                                  id="input-timeout"
                                  class="form-control"
                                  placeholder="Timeout In Seconds"
                                  name="timeout"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-protocol"
                                >
                                  Protocol
                                </label>
                                <div class="input-group mb-3">
                                  <select
                                    class="custom-select"
                                    id="input-protocol"
                                    aria-label="Protocols"
                                  >
                                    <option selected>Choose...</option>
                                    <option value="1">HTTP</option>
                                    <option value="2">HTTPS</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-method"
                                >
                                  Method
                                </label>
                                <div class="input-group mb-3">
                                  <select
                                    class="custom-select"
                                    id="input-method"
                                    aria-label="Methods"
                                  >
                                    <option selected>Choose...</option>
                                    <option value="1">GET</option>
                                    <option value="2">PUT</option>
                                    <option value="3">POST</option>
                                    <option value="4">DELETE</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>
                        Close
                      </Button>{" "}
                      <Button color="primary" onClick={this.toggle}>
                        Save Changes
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
              {checkType === "edit" && (
                <>
                  <Col xs="6" lg="6" className="text-right">
                    <Button
                      className="btn-md btn-neutral"
                      onClick={this.toggle}
                    >
                      Edit Check
                    </Button>
                  </Col>
                  <Modal
                    isOpen={this.state.showModal}
                    toggle={this.toggle}
                    centered
                  >
                    <ModalHeader toggle={this.toggle}>
                      <h3 class="modal-title" id="newCheckModalLabel">
                        Edit Check
                      </h3>
                    </ModalHeader>
                    <ModalBody>
                      <form>
                        <h6 class="heading-small text-muted mb-4">
                          General information
                        </h6>
                        <div class="pl-lg-4">
                          <div class="row">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-name"
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id="input-name"
                                  class="form-control"
                                  placeholder="Check Name"
                                  name="name"
                                />
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-url"
                                >
                                  URL
                                </label>
                                <input
                                  type="text"
                                  id="input-url"
                                  class="form-control"
                                  placeholder="Your service's URL"
                                  name="url"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr class="my-4" />
                        {/* <!-- Address --> */}
                        <h6 class="heading-small text-muted mb-4">
                          Check Details
                        </h6>
                        <div class="pl-lg-4">
                          <div class="row">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-success-codes"
                                >
                                  Success Codes
                                </label>
                                <input
                                  type="text"
                                  id="input-success-codes"
                                  class="form-control"
                                  placeholder="Saperated by Comma (200, 201, 202)"
                                  name="successCodes"
                                />
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-timeout"
                                >
                                  Timeout (s)
                                </label>
                                <input
                                  type="number"
                                  id="input-timeout"
                                  class="form-control"
                                  placeholder="Timeout In Seconds"
                                  name="timeout"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-protocol"
                                >
                                  Protocol
                                </label>
                                <div class="input-group mb-3">
                                  <select
                                    class="custom-select"
                                    id="input-protocol"
                                    aria-label="Protocols"
                                  >
                                    <option selected>Choose...</option>
                                    <option value="1">HTTP</option>
                                    <option value="2">HTTPS</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                <label
                                  class="form-control-label"
                                  for="input-method"
                                >
                                  Method
                                </label>
                                <div class="input-group mb-3">
                                  <select
                                    class="custom-select"
                                    id="input-method"
                                    aria-label="Methods"
                                  >
                                    <option selected>Choose...</option>
                                    <option value="1">GET</option>
                                    <option value="2">PUT</option>
                                    <option value="3">POST</option>
                                    <option value="4">DELETE</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>
                        Close
                      </Button>{" "}
                      <Button color="primary" onClick={this.toggle}>
                        Save Changes
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
            </Row>
            <Row>
              {this.props.cards &&
                this.props.cards.map((ele) => (
                  <Col lg="6" xl="4">
                    <Card className="card-stats mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <Col>
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {ele.cardTitle}
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">
                              {ele.data}
                            </span>
                          </Col>
                          <Col className="col-auto">
                            <div
                              className={`icon icon-shape bg-${ele.iconBg} text-white rounded-circle shadow`}
                            >
                              <i className={`${ele.icon}`} />
                            </div>
                          </Col>
                        </Row>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className={`${ele.cardFooterColor} mr-2`}>
                            <i className={ele.statIndicator} />
                            {ele.cardFooterData}
                          </span>
                          <span className="text-nowrap">{ele.since}</span>
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
            </Row>
            <Row className="pb-2">
                {
                    this.props.heading && 
                    this.props.mainHeading && 
                    this.props.headingDesc && (
                        <>
                            <Col lg="12" md="10">
                                <h2 className="display-3 text-white">
                                    {this.props.mainHeading}
                                </h2>
                                <p className="text-white">
                                    {this.props.headingDesc}
                                </p>
                            </Col>
                        </>
                    )
                }
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default UserHeader;
