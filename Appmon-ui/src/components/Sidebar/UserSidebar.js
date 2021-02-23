import React, { Component } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

import Logo from "../../assets/img/brand/newLogo.png";

export default class UserSidebar extends Component {
  state = {
    collapseOpen: false,
  };

  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };

  closeCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };

  createLinks = (routes) => {
    return routes.map((props, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={props.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
          >
            <i className={props.icon} />
            {props.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  render() {
    const { routes } = this.props;
    return (
      <>
        <Navbar
          className="navbar-vertical fixed-left navbar-light bg-white"
          expand="md"
          id="sidenav-main"
        >
          <Container fluid>
            <button
              className="navbar-toggler"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <NavbarBrand className="pt-0" tag={NavLinkRRD} to="/dashboard">
              <img alt="Appmon Logo" className="navbar-brand-img" src={Logo} />
            </NavbarBrand>
            <Nav className="align-items-center d-md-none">
              <UncontrolledDropdown nav>
                <DropdownToggle nav className="nav-link-icon">
                  <i className="ni ni-bell-55" />
                </DropdownToggle>
                <DropdownMenu
                  aria-labelledby="navbar-default_dropdown_1"
                  className="dropdown-menu-arrow"
                  right
                >
                  <DropdownItem>Action</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        src={
                          require("../../assets/img/theme/team-1-800x800.jpg")
                            .default
                        }
                        alt="User"
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        User Name
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome !</h6>
                  </DropdownItem>
                  <DropdownItem to="/profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My Profile</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    onClick={() => {
                      console.log("Logout");
                    }}
                  >
                    <i className="ni ni-user-run" />
                    <span> Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/">
                      <img alt="Appmon Logo" src={Logo} />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler "
                      type="button"
                      onClick={this.toggleCollapse}
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Form className="mt-4 mb-3 d-md-none">
                <InputGroup className="input-group-rounded input-group-merge">
                  <Input
                    aria-label="Search"
                    className="form-control-rounded form-control-prepend"
                    placeholder="Search"
                    type="search"
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <span className="fa fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
              <Nav navbar>{this.createLinks(routes)}</Nav>
              <hr className="my-3" />
              <h6 className="navbar-heading text-muted">Documentation</h6>
              <Nav className="mb-md-3" navbar>
                <NavItem>
                  <NavLink to="/docs" tag={NavLinkRRD}>
                    <i className="ni ni-single-copy-04 text-default" />
                    Docs
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/upgrade" tag={NavLinkRRD}>
                    <i className="ni ni-send text-dark" />
                    Upgrade to Pro
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
