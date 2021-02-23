import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";

class AuthHeader extends Component {
  render() {
    return (
      <>
        <div className="header bg-gradient-primary py-7 py-lg-8">
          { !this.props.showHeader && (
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    <h1 className="text-white">Welcome</h1>
                  </Col>
                </Row>
              </div>
            </Container>
          )}
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </>
    );
  }
}

export default AuthHeader;
