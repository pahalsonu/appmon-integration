import React from "react";

// reactstrap components
import { Container, Row } from "reactstrap";

import { Link } from "react-router-dom";
// core components

class Upgrade extends React.Component {
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7 mb-5" fluid>
          {/* Table */}
          <Row className="mt--5">
            <div class="col-md-10 ml-auto mr-auto">
              <div class="card card-upgrade">
                <div class="card-header text-center border-bottom-0">
                  <h4 class="card-title">Appmon Dashboard PRO</h4>
                  <p class="card-category">
                    Are you looking for more checks? Please check our Premium
                    Version of Appmon Dashboard.
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive table-upgrade">
                    <table class="table">
                      <thead>
                        <tr>
                          <th></th>
                          <th class="text-center">Free</th>
                          <th class="text-center">PRO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Checks</td>
                          <td class="text-center">10</td>
                          <td class="text-center">200</td>
                        </tr>
                        <tr>
                          <td>Status Codes</td>
                          <td class="text-center">http,https</td>
                          <td class="text-center">+ ftp, smtp</td>
                        </tr>
                        <tr>
                          <td>Example Pages</td>
                          <td class="text-center">6</td>
                          <td class="text-center">25</td>
                        </tr>
                        <tr>
                          <td>Premium Support</td>
                          <td class="text-center">
                            <i class="ni ni-fat-remove text-danger"></i>
                          </td>
                          <td class="text-center">
                            <i class="ni ni-check-bold text-success"></i>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td class="text-center">Free</td>
                          <td class="text-center">Just $29.29</td>
                        </tr>
                        <tr>
                          <td class="text-center"></td>
                          <td class="text-center">
                            <span class="btn btn-round btn-default disabled">
                              Current Version
                            </span>
                          </td>
                          <td class="text-center">
                            <Link to="/pro" class="btn btn-round btn-primary">
                              Upgrade to PRO
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Upgrade;