import React, { Component } from "react";
// import { Link } from "react-router-dom";

import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class AuthFooter extends Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-item-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left lext-muted">
                  &#169; 2021{" "}
                  <a
                    className="nav-footer justify-content-center justify-content-xl-end"
                    href="https://thehackingschool.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    The Hacking School
                  </a>
                </div>
              </Col>
              <Col xl="6">
                <Nav className="nav-footer justify-content-center justify-content-xl-end">
                  <NavItem>
                    <NavLink
                      href="https://thehackingschool.com"
                      target="_blank"
                    >
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="https://thehackingschool.com"
                      target="_blank"
                    >
                      License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default AuthFooter;