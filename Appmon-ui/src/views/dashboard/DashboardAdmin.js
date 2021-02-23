import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
// reactstrap components
import {
  Card,
  CardHeader,
  NavItem,
  NavLink,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

// core components
import { chartOptions, parseOptions } from "../../variables/charts.js";

class DashboardAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      dropA1: false,
      dropA2: false,
      dropA3: false,
      dropA4: false,
      dropA5: false,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };
  toggle = (dropDown) => {
    this.setState({ [dropDown]: !this.state[dropDown] });
  };
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7 mb-5" fluid>
          <Row className="mt-5">
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
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1,
                            })}
                            href=""
                            onClick={(e) => this.toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Active</span>
                            <span className="d-md-none">A</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2,
                            })}
                            data-toggle="tab"
                            href=""
                            onClick={(e) => this.toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Paused</span>
                            <span className="d-md-none">P</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">User Name</th>
                      <th scope="col">Total Checks</th>
                      <th scope="col">Active Checks</th>
                      <th scope="col">Last Active On</th>
                      <th scope="col">Membership Plan</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.userData &&
                      this.props.userData.map((user, key) => (
                        <tr>
                          <th scope="row">{user.name}</th>
                          <td>{user.totalChecks}</td>
                          <td>{user.activeChecks}</td>
                          <td>{user.lastActiveOn}</td>
                          <td>{user.membershipPlan}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
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

export default DashboardAdmin;
