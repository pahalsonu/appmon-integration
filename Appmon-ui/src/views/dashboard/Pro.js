import React, { Component } from "react";

import { Container } from "reactstrap";

class Pro extends Component {
  render() {
    return (
      <>
        <Container className="mt--7" fluid>
          <div class="row mb-5">
            <div class="col-xl-12">
              <div class="card p-4">
                <h3>Plan Details</h3>
                <div class="row">
                  <div class="col-md-8">
                    <table class="table ">
                      <tbody>
                        <tr>
                          <td>Upto 20 URL's</td>
                        </tr>
                        <tr>
                          <td>Upto 20 Protocols per URL</td>
                        </tr>
                        <tr>
                          <td>Actionable Customised Report</td>
                        </tr>
                        <tr>
                          <td>24/7 Support</td>
                        </tr>
                        <tr>
                          <td>Special Offers on New Features</td>
                        </tr>
                        <tr>
                          <td>Exclusive Community Support</td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <div class="row mb-2">
                        <div class="col-md-8">
                          <h3>Payment Support</h3>
                        </div>
                        <div class="col-md-4 text-right">
                          <i class="fa fa-cc-visa fa-2x"></i>
                          <i class="fa fa-cc-mastercard fa-2x"></i>
                          <i class="fa fa-cc-amex fa-2x"></i>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col-md-12">
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number"
                            class="form-control"
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-8">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name on the Card"
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-2">
                          <input
                            type="text"
                            name="expire"
                            placeholder="MM/YY"
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-2">
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            class="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card mb-4 p-3 shadow">
                      <h3 class="mb-3">Summary (1 item)</h3>
                      <div class="row mt-3">
                        <div class="col-md-9">Sub Total</div>
                        <div class="col-md-3">$29.59</div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-md-9">Taxes</div>
                        <div class="col-md-3">$29.59</div>
                      </div>
                      <hr />
                      <div class="row mt-4">
                        <div class="col-md-9">Total</div>
                        <div class="col-md-3">$59.59</div>
                      </div>
                      <hr />
                    </div>
                    <input
                      type="submit"
                      value="Complete Order"
                      class="btn btn-primary btn-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }
}

export default Pro;