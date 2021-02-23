import React from "react";

import {
  Card,
  CardHeader,
  Table,
  Container,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
} from "reactstrap";

class AdminSupport extends React.Component {
  state = {
    dropA1: false,
    dropA2: false,
    dropA3: false,
    dropA4: false,
  };
  toggle = (dropDown) => {
    this.setState({ [dropDown]: !this.state[dropDown] });
  };
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7 mb-5" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Details
                      </h6>
                      <h3 className="mb-0">Users</h3>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">Case Id</th>
                      <th scope="col">Email</th>
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
                    {this.props.tickets &&
                      this.props.tickets.map((ticket, key) => (
                        <tr
                          class="table-row"
                          data-toggle="modal"
                          data-target="#activeCustomerTicket"
                        >
                          <th scope="row">{ticket.caseId}</th>
                          <td>{ticket.email}</td>
                          <td>{ticket.category}</td>
                          <td>{ticket.createdOn}</td>
                          <td>{ticket.subject}</td>
                          <td>{ticket.description}</td>
                          <td>{ticket.type}</td>
                          <td>{ticket.severity}</td>
                          <td>{ticket.status}</td>
                          <td>
                            <Dropdown
                              isOpen={this.state[`dropA${key}`]}
                              toggle={() => {
                                this.toggle(`dropA${key}`);
                              }}
                            >
                              <DropdownToggle caret size="sm" color="primary">
                                Actions
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default AdminSupport;
