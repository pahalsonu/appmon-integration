import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
} from "reactstrap";
// core components

class Support extends React.Component {
  state = {
    showModal: false,
    dropA1: false,
    dropA2: false,
    dropA3: false,
    dropA4: false,
    dropA5: false,
  };

  toggleDropDown = (dropDown) => {
    this.setState({ [dropDown]: !this.state[dropDown] });
  };

  toggle = () => this.setState({ showModal: !this.state.showModal });
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7 mb-5" fluid>
          {/* Table */}
          <Modal isOpen={this.state.showModal} toggle={this.toggle} centered>
            <ModalHeader toggle={this.toggle}>
              {" "}
              <h3 class="modal-title" id="newCheckModalLabel">
                New Support Case
              </h3>
            </ModalHeader>
            <ModalBody>
              <form>
                <div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label" for="input-name">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="caseSubject"
                          class="form-control"
                          name="caseSubject"
                          placeholder="Enter Check"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label" for="input-name">
                          Check Name
                        </label>
                        <input
                          type="text"
                          id="checkName"
                          class="form-control"
                          name="checkName"
                          placeholder="Enter Check Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-success-codes"
                        >
                          Description
                        </label>
                        <textarea
                          type="text"
                          id="caseDescription"
                          class="form-control"
                          name="caseDescription"
                          placeholder="Describe your issue here"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-success-codes"
                        >
                          Type
                        </label>
                        <select
                          id="caseType"
                          class="form-control"
                          name="caseType"
                        >
                          <option value="">-- Select Type --</option>
                          <option value="ti">Technical Issue</option>
                          <option value="fr">Feature Request</option>
                          <option value="sq">Sales Question</option>
                          <option value="sq">Sales Question</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-success-codes"
                        >
                          Severity
                        </label>
                        <select
                          id="caseSeverity"
                          class="form-control"
                          name="caseSeverity"
                        >
                          <option value="">-- Select Severity --</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
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
                Create Case
              </Button>
            </ModalFooter>
          </Modal>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="mb-0">Recent Cases</h3>
                    </Col>
                    <Col className="text-right">
                      <Button color="primary" onClick={this.toggle}>
                        Create Support Case
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">Case Id</th>
                      <th scope="col">Category</th>
                      <th scope="col">Created</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Description</th>
                      <th scope="col">Type</th>
                      <th scope="col">Severity</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.props.supportData &&
                      this.props.supportData.map((item, index) => (
                        <>
                          <tr
                            class="table-row"
                            data-toggle="modal"
                            data-target="#activeCustomerTicket"
                          >
                            <th scope="row">{item.id}</th>
                            <td>{item.category}</td>
                            <td>{item.createdAt}</td>
                            <td>{item.subject}</td>
                            <td>{item.desc}</td>
                            <td>{item.type}</td>
                            <td>{item.severity}</td>
                            <td>{item.status}</td>
                            <td>
                              <Dropdown
                                isOpen={this.state[`dropA${index}`]}
                                toggle={() => {
                                  this.toggleDropDown(`dropA${index}`);
                                }}
                              >
                                <DropdownToggle caret color="primary">
                                  Actions
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem>Edit</DropdownItem>
                                  <DropdownItem>Delete</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </td>
                          </tr>
                        </>
                      ))}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Support;
