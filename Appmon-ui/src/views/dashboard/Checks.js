import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import { Link } from "react-router-dom";

class Checks extends React.Component {
  state = {
    dropA1: false,
    dropA2: false,
    dropA3: false,
    dropA4: false,
    dropA5: false,
    dropP1: false,
    dropP2: false,
    dropP3: false,
    dropP4: false,
    dropP5: false,
  };
  toggle = (dropDown) => {
    this.setState({ [dropDown]: !this.state[dropDown] });
  };
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Active Checks</h3>
                </CardHeader>
                <Table
                  className="align-items-center table-flush table-hover"
                  responsive
                >
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Protocol</th>
                      <th scope="col">Method</th>
                      <th scope="col">Success Codes</th>
                      <th scope="col">Timeout</th>
                      <th scope="col">Status changed</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.activeCheckData &&
                      this.props.activeCheckData.map((check, index) => (
                        <>
                          <tr class="table-row">
                            <th scope="row">
                              <Link to={`/dashboard/checks/${check.id}`}>
                                {check.name}
                              </Link>
                            </th>
                            <td>{check.protocol}</td>
                            <td>{check.method}</td>
                            <td>{check.successCodes}</td>
                            <td>{check.timeOut}</td>
                            <td>{check.statusLastChanged}</td>
                            <td>
                              <i
                                className={`fas fa-${check.icon}-circle text-${check.messageStatus} mr-1`}
                              ></i>{" "}
                              {check.status}
                            </td>
                            <td>
                              <Dropdown
                                isOpen={this.state[`dropA${index}`]}
                                toggle={() => {
                                  this.toggle(`dropA${index}`);
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
          {/* T2 */}
          <Row className="my-5">
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Paused Checks</h3>
                </CardHeader>
                <Table
                  className="align-items-center table-flush table-hover"
                  responsive
                >
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Protocol</th>
                      <th scope="col">Method</th>
                      <th scope="col">Success Codes</th>
                      <th scope="col">Timeout</th>
                      <th scope="col">Status changed</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.pausedCheckData &&
                      this.props.pausedCheckData.map((check, index) => (
                        <>
                          <tr class="table-row">
                            <th scope="row">
                              <Link to={`/dashboard/checks/${check.id}`}>{check.name}</Link>
                            </th>
                            <td>{check.protocol}</td>
                            <td>{check.method}</td>
                            <td>{check.successCodes}</td>
                            <td>{check.timeOut}</td>
                            <td>{check.statusLastChanged}</td>
                            <td>
                            <i className={`fas fa-${check.icon}-circle text-${check.messageStatus} mr-1`}></i>{" "} {check.status}
                            </td>
                            <td>
                              <Dropdown
                                isOpen={this.state[`dropP${index}`]}
                                toggle={() => {
                                  this.toggle(`dropP${index}`);
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

export default Checks;
