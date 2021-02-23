import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "../../variables/charts.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      activeCheck: 1,
      chartExample1Data: "data1",
      showNewCheck: false,
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
  toggleCheckTable = (e, index) => {
    e.preventDefault();
    this.setState({
      activeCheck: index,
    });
  };
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Performance
                      </h6>
                      <h2 className="text-white mb-0">Uptime vs Downtime</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1,
                            })}
                            href="#pablo"
                            onClick={(e) => this.toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Uptime</span>
                            <span className="d-md-none">U</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => this.toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Downtime</span>
                            <span className="d-md-none">D</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      data={chartExample1[this.state.chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Data
                      </h6>
                      <h2 className="mb-0">Total Checks</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                  <Bar
                    data={chartExample2['data1']}
                    options={chartExample2.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="my-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Details
                      </h6>
                      <h3 className="mb-0">Checks</h3>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeCheck === 1,
                            })}
                            href="#pablo"
                            onClick={(e) => this.toggleCheckTable(e, 1)}
                          >
                            <span className="d-none d-md-block">Active</span>
                            <span className="d-md-none">A</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeCheck === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => this.toggleCheckTable(e, 2)}
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
                      <th scope="col">Name</th>
                      <th scope="col">Protocol</th>
                      <th scope="col">Method</th>
                      <th scope="col">Success Codes</th>
                      <th scope="col">Timeout (S)</th>
                      <th scope="col">Status last changed</th>
                      <th scope="col">Current Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        this.props.checkData && this.props.checkData.map(check => (
                            <tr>
                                <th scope="row">{check.name}</th>
                                <td>{check.protocol}</td>
                                <td>{check.method}</td>
                                <td>{check.successCodes}</td>
                                <td>{check.timeOut}</td>
                                <td>{check.statusLastChanged}</td>
                                <td>
                                    <i className={`fas fa-${check.icon}-circle text-${check.messageStatus} mr-1`}></i> {check.status}
                                </td>
                            </tr>
                        ))
                    }
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

export default Dashboard;