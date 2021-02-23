import React from "react";

// reactstrap components
import { Container, Row } from "reactstrap";

class Documentation extends React.Component {
  render() {
    return (
      <>
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div class="col-xl-12 order-xl-12 col-md-12">
              <div class="card card-profile mt-3">
                <div class="row justify-content-center">
                  <div class="col-lg-12 order-lg-12"></div>
                </div>
                <div class="card-body">
                  <div class="card-profile-stats d-flex justify-content-center">
                    <div class="text-center">
                      <h2 class="display-3 text-default">Documentation</h2>
                    </div>
                  </div>
                </div>
                <div class="mt-1 py-5 border-top">
                  <div class="row">
                    <div class="col-md-3">
                      <div
                        class="fixed-section affix-top"
                        data-spy="affix"
                        data-offset-top="400"
                      >
                        <ul style={{ listStyle: "none" }}>
                          <li>
                            <a href="#introduction">Introduction</a>
                          </li>
                          <li>
                            <a href="#pablo">&nbsp;</a>
                          </li>
                          <li>
                            <a href="#appmonitor">Application Monitoring</a>
                          </li>
                          <li>
                            <a href="#notifications">Notifications</a>
                          </li>
                          <li>
                            <a href="#dashboards">Dashboard</a>
                          </li>
                          <li>
                            <a href="#support">Support</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="col-md-8 col-md-offset-1">
                      <div class="tim-container mx-2">
                        {/* <!-- License Row --> */}
                        <div
                          class="tim-row tim-row-first my-0"
                          id="introduction"
                        >
                          <h2 class="text-center pb-4">Introduction</h2>
                          <legend></legend>
                          <div>
                            <p>
                              Originally created by a designer and a developer
                              at the hacking school.
                            </p>
                            <p>
                              Appmon is a Effortless Server Monitoring Solution.
                              A Cloud based Robust and meticulous monitoring
                              solution for native and hybrid enterprise
                              environments
                            </p>
                          </div>
                        </div>

                        <div class="tim-row my-4" id="appmonitor">
                          <h2 class="text-center py-4">
                            Application Monitoring
                          </h2>
                          <legend></legend>

                          <p>
                            Its very crutial to monitor your servers and
                            websites so that its available to the users 24X7.
                            Needless to say there shouldnt be any unplanned
                            outages and applications are supposed to be up and
                            running providing the same performance to the
                            customers all the time.
                          </p>
                          <br />
                          <p>With Appmon,</p>
                          <ul>
                            <li>
                              Monitor your application servers, websites, Email
                              Servers
                            </li>
                            <li>Get Insights on server's performance</li>
                            <li>
                              First hand view on the peak traffic hitting the
                              server
                            </li>
                            <li>
                              Take actions on server scaling metrics provided
                            </li>
                          </ul>
                          <p>
                            With these key features and pro-active monitoring
                            that we provide, you can prevent application server
                            failures and thereby delivering your customers
                            upmost satisfaction in your product
                          </p>
                        </div>

                        <div class="tim-row my-4" id="notifications">
                          <h2 class="text-center py-4">
                            Alerts and Notifications
                          </h2>
                          <legend></legend>

                          <p>
                            Our Rapid Notification System enables our customers
                            to get notified on their servers in no time Get
                            Notifications via SMS, Email or any Industry grade
                            Communication Systems available in the market like
                            slack, pagerduty, whatsapp.
                          </p>
                          <p>
                            Our easy to configure notification system allows you
                            to configure any of these without any hassles Email
                            notification sent to configured Email Address /
                            Group Mobile SMS where texts can be customized Slack
                            notifications are integrated and configurable with
                            Appmon Pagerduty alerts to switch notifications per
                            your organization needs ... many more
                          </p>
                        </div>
                        <div class="tim-row my-4" id="dashboards">
                          <h2 class="text-center py-4">
                            Customizable Dashboards
                          </h2>
                          <legend></legend>

                          <p>
                            Its very crutial to monitor your servers and
                            websites so that its available to the users 24X7.
                            Needless to say there shouldnt be any unplanned
                            outages and applications are supposed to be up and
                            running providing the same performance to the
                            customers all the time.
                          </p>
                          <br />
                          <p>With Appmon,</p>
                          <ul>
                            <li>
                              Monitor your application servers, websites, Email
                            </li>
                            <li>
                              Servers Get Insights on server's performance First
                              hand
                            </li>
                            <li>
                              view on the peak traffic hitting the server Take
                              actions
                            </li>
                            <li>on server scaling metrics provided</li>
                          </ul>
                          <p>
                            With these key features and pro-active monitoring
                            that we provide, you can prevent application server
                            failures and thereby delivering your customers
                            upmost satisfaction in your product
                          </p>
                        </div>

                        <div class="tim-row my-4" id="support">
                          <h2 class="text-center py-4">Support</h2>
                          <legend></legend>

                          <p>
                            Its very crutial to monitor your servers and
                            websites so that its available to the users 24X7.
                            Needless to say there shouldnt be any unplanned
                            outages and applications are supposed to be up and
                            running providing the same performance to the
                            customers all the time.
                          </p>
                          <br />
                          <p>With Appmon,</p>
                          <ul>
                            <li>
                              Monitor your application servers, websites, Email
                            </li>
                            <li>
                              Servers Get Insights on server's performance First
                              hand
                            </li>
                            <li>
                              view on the peak traffic hitting the server Take
                              actions
                            </li>
                            <li>on server scaling metrics provided</li>
                          </ul>
                          <p>
                            With these key features and pro-active monitoring
                            that we provide, you can prevent application server
                            failures and thereby delivering your customers
                            upmost satisfaction in your product
                          </p>
                        </div>
                        {/* <!-- end container --> */}
                      </div>
                    </div>
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

export default Documentation;