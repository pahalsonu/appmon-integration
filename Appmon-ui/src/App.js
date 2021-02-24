import React, {Component} from "react";
import AuthLayout from "./layouts/AuthLayout";
// static and dynamic comp

import Login from "./views/Auth/Login";
import ForgotPassword from "./views/Auth/ForgotPassword";
import Register from "./views/Auth/Register";
import Dashboard from "./views/dashboard/Dashboard";
import Profile from "./views/Auth/Profile";
import Checks from "./views/dashboard/Checks";
import Support from "./views/dashboard/Support";
import DashboardCheck from "./views/dashboard/DashboardCheck";
import Pro from "./views/dashboard/Pro";
import Upgrade from "./views/dashboard/Upgrade";
import Documentation from "./views/dashboard/Documentation";
import DashboardAdmin from "./views/dashboard/DashboardAdmin";
import AdminSupport from "./views/dashboard/AdminSupport";
import Terms from "./views/Terms";

import UserLayout from "./layouts/UserLayout";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/argon-dashboard-react.css";

class App extends Component  {
state ={
  cards : [""],
  checkData : [""],
  activeCheckData : [""],
  pausedCheckData : [""],
  supportData : [''],
  cardsDashboardsChecks : [""],
  checkLogs : [''],
  adminCards : [''],
  adminUserdata : [''],
  tickets : ['']
  
}

componentDidMount() {
  //sending default card data
this.setState({
  cards:[
    {
      cardTitle: "Total Checks",
      cardIcon: "ni ni-active-40",
      iconBg: "gradient-red",
      data: "350",
      changeColor: "text-success mr-2",
      change: "fa fa-plus",
      changeNumber: "5 New Checks",
      since: "Since Last Month",
    },
    {
      cardTitle: "Total Active Checks",
      cardIcon: "ni ni-chart-pie-35",
      iconBg: "gradient-orange",
      data: "250",
      changeColor: "text-success mr-2",
      change: "fa fa-arrow-up",
      changeNumber: "3.48%",
      since: "Since Last Month",
    },
    {
      cardTitle: "Uptime Ratio",
      cardIcon: "ni ni-chart-bar-32",
      iconBg: "gradient-info",
      data: "90 %",
      changeColor: "text-success mr-2",
      change: "fa fa-arrow-up",
      changeNumber: "2.2%",
      since: "Since Last Month",
    },
  ],
 
});
// //sending default check data
this.setState({
  checkData : [
    {
      name: "Random Text",
      protocol: "HTTP",
      method: "GET",
      successCodes: "200, 201, 202",
      timeOut: "3",
      statusLastChanged: "30 mins ago",
      icon: "check",
      messageStatus: "success",
      status: "Up",
    },
    {
      name: "Random Text2",
      protocol: "HTTPS",
      method: "POST",
      successCodes: "200, 201, 202",
      timeOut: "5",
      statusLastChanged: "3 mins ago",
      icon: "times",
      messageStatus: "warning",
      status: "Down",
    },
  ]
});

 //sending default activecheck data
this.setState({
  activeCheckData : 
    [
      {
        id: 1,
        name: "Random Text",
        protocol: "HTTP",
        method: "GET",
        successCodes: "200, 201, 202",
        timeOut: "3",
        statusLastChanged: "30 mins ago",
        icon: "check",
        messageStatus: "success",
        status: "Up",
      },
      {
        id: 2,
        name: "Random Text",
        protocol: "HTTP",
        method: "GET",
        successCodes: "200",
        timeOut: "3",
        statusLastChanged: "30 mins ago",
        icon: "times",
        messageStatus: "warning",
        status: "Down",
      },
      {
        id: 3,
        name: "Random API",
        protocol: "HTTP",
        method: "GET",
        successCodes: "200, 201, 202",
        timeOut: "13",
        statusLastChanged: "3 mins ago",
        icon: "check",
        messageStatus: "success",
        status: "Up",
      },
    ]
  
});
//sending default paused check data

this.setState({
  pausedCheckData : [
    {
      id: 1,
      name: "Random Text",
      protocol: "HTTP",
      method: "GET",
      successCodes: "200, 201, 202",
      timeOut: "3",
      statusLastChanged: "30 mins ago",
      icon: "pause",
      messageStatus: "warning",
      status: "Paused",
    },
    {
      id: 2,
      name: "Random Text",
      protocol: "HTTP",
      method: "GET",
      successCodes: "200",
      timeOut: "3",
      statusLastChanged: "30 mins ago",
      icon: "pause",
      messageStatus: "warning",
      status: "Paused",
    },
    {
      id: 3,
      name: "Random API",
      protocol: "HTTP",
      method: "GET",
      successCodes: "200, 201, 202",
      timeOut: "13",
      statusLastChanged: "3 mins ago",
      icon: "pause",
      messageStatus: "warning",
      status: "Paused",
    },
  ]
})

// sending support check data
this.setState({
  supportData : [
    {
      id: "198623",
      category: "Check",
      createdAt: "25/11/2020",
      subject: "Unable to add check",
      desc: "Description goes here",
      type: "Technical Issue",
      severity: "High",
      status: "Open",
    },
    {
      id: "912454",
      category: "Account",
      createdAt: "25/11/2020",
      subject: "Not getting alerts",
      desc: "Description goes here",
      type: "Technical Issue",
      severity: "High",
      status: "In Progress",
    },

  ]
})

//dashboards checks cards data

this.setState ({
  cardsDashboardsChecks : 
  [
    {
      cardTitle: "Downtime",
      cardIcon: "ni ni-watch-time",
      iconBg: "gradient-red",
      data: "0.01%",
      changeColor: "text-danger mr-2",
      change: "fa fa-arrow-down",
      changeNumber: "(1 Outage)",
      since: "Since Last Month",
    },
    {
      cardTitle: "Uptime",
      cardIcon: "ni ni-sound-wave",
      iconBg: "gradient-orange",
      data: "99.9%",
      changeColor: "text-success mr-2",
      change: "fa fa-arrow-up",
      changeNumber: "(1 Outage)",
      since: "Since Last Month",
    },
    {
      cardTitle: "Response TIme",
      cardIcon: "ni ni-delivery-fast",
      iconBg: "gradient-green",
      data: "114ms",
      changeColor: "text-muted mr-2",
      change: "",
      changeNumber: "(Min: 112ms , Max : 116ms)",
      since: "",
    },
  ]
})
this.setState({
  checkLogs : [
    {
      icon: "check",
      messageStatus: "success",
      status: "Up",
      time: "27-12-2020 11:59:14 AM",
      statusLastChanged: "1m ago",
      responseTime: "112 ms",
    },
    {
      icon: "times",
      messageStatus: "warning",
      status: "Down",
      time: "27-12-2020 11:59:14 AM",
      statusLastChanged: "10m ago",
      responseTime: "115 ms",
    },
  ]
})

//sending admin cards data
this.setState({
adminCards :[
  {
    cardTitle: "Total Users",
    cardIcon: "ni ni-active-40",
    iconBg: "gradient-red",
    data: "450",
    changeColor: "text-success mr-2",
    change: "fa fa-plus",
    changeNumber: "525 Users",
    since: "Since Last Month",
  },
  {
    cardTitle: "Total Active Checks",
    cardIcon: "ni ni-chart-pie-35",
    iconBg: "gradient-orange",
    data: "2500",
    changeColor: "text-success mr-2",
    change: "fa fa-arrow-up",
    changeNumber: "10.48%",
    since: "Since Last Month",
  },
  {
    cardTitle: "Inactive Users",
    cardIcon: "ni ni-chart-bar-32",
    iconBg: "gradient-info",
    data: "560",
    changeColor: "text-success mr-2",
    change: "fa fa-arrow-up",
    changeNumber: "2.2%",
    since: "Since Last Month",
  },
]

})

//sending admin user data
this.setState({
  adminUserdata :[
    {
      name: "Aditya278",
      totalChecks: "20",
      activeChecks: "12",
      lastActiveOn: "11/20/2020",
      membershipPlan: "Free",
      email: "aditya@appmon.online",
      phone: "84084084040",
    },
    {
      name: "Sharath",
      totalChecks: "25",
      activeChecks: "2",
      lastActiveOn: "11/20/2020",
      membershipPlan: "Paid",
      email: "sharu@appmon.online",
      phone: "9876543210",
    },
    {
      name: "Anil",
      totalChecks: "20",
      activeChecks: "12",
      lastActiveOn: "11/20/2020",
      membershipPlan: "Free",
      email: "aditya@appmon.online",
      phone: "84084084040",
    },
    {
      name: "Sonu",
      totalChecks: "20",
      activeChecks: "12",
      lastActiveOn: "11/20/2020",
      membershipPlan: "Free",
      email: "aditya@appmon.online",
      phone: "84084084040",
    },
  ]
})

//sending tickets data
this.setState({
  tickets : [
    {
      caseId : "198623",
      email : "aditya@appmon.ol",
      category : "Check",
      createdOn : "25/11/2020",
      subject : "Unable to add check",
      description : "Description goes here",
      type : "Technical Issue",
      severity : "High",
      status : "Open",
    },
    {
      caseId : "628454",
      email : "aditya@appmon.ol",
      category : "Dashboard",
      createdOn : "25/11/2020",
      subject : "Add slack notifications",
      description : "Description goes here",
      type : "Feature Request",
      severity : "Medium",
      status : "Open",
    },
    {
      caseId : "478456",
      email : "aditya@appmon.ol",
      category : "Check",
      createdOn : "25/11/2020",
      subject : "Unable to reset password",
      description : "Description goes here",
      type : "Technical Issue",
      severity : "High",
      status : "Closed",
    },
    {
      caseId : "198623",
      email : "aditya@appmon.ol",
      category : "Check",
      createdOn : "25/11/2020",
      subject : "Unable to add check",
      description : "Description goes here",
      type : "Technical Issue",
      severity : "High",
      status : "Open",
    },
  ]
})

}

 render(){
  return (
    <Router>
      <Switch>
        <Route exact path="/dashboard">
          <UserLayout
            component={Dashboard}
            checkType={"new"}
            cards={this.state.cards}
            checkData={this.state.checkData}
          />
        </Route>
        <Route exact path="/dashboard/checks">
          <UserLayout
            component={Checks}
            activeCheckData={this.state.activeCheckData}
            pausedCheckData={this.state.pausedCheckData}
          />
        </Route>
        <Route exact path="/dashboard/support">
          <UserLayout
            supportData={this.state.supportData}
            heading={true}
            mainHeading="Support Center"
            headingDesc="Each and every one of our customer care agents have a mission to assist all your needs in order to help you with our application related issues. Please raise a support case with detail description of the issues. One of our customer care agent will reach out to you at the earliest and try to fix the issue."
          />
        </Route>
        <Route exact path="/dashboard/checks/:id">
          <UserLayout
            component={DashboardCheck}
            showCards={true}
            checkType="edit"
            cards={ this.state.cardsDashboardsChecks}
            checkLogs={this.state.checkLogs}
          />
        </Route>
        <Route exact path="/profile">
          <UserLayout component={Profile} />
        </Route>
        <Route exact path="/docs">
          <UserLayout component={Documentation} />
        </Route>
        <Route exact path="/upgrade">
          <UserLayout component={Upgrade} />
        </Route>
        <Route exact path="/pro">
          <UserLayout
            component={Pro}
            heading={true}
            mainHeading="Make your Payment"
            headingDesc="Please enter the details below.."
          />
        </Route>
        <Route exact path="/dashboard/admin">
          <UserLayout
            component={DashboardAdmin}
            showCards={true}
         cards ={this.state.adminCards}
            userData = {this.setState.adminUserdata}
          />
        </Route>
        <Route exact path="/dashboard/adminSupport">
          <UserLayout 
            component={AdminSupport}             
            heading={true}
            mainHeading="Hello Admin"
            headingDesc="Please click on a row to view/update the details"
            tickets={this.state.tickets}
          />
        </Route>
        <Route exact path="/login">
          <AuthLayout component={Login} />
        </Route>
        <Route exact path="/forgotPassword">
          <AuthLayout component={ForgotPassword} />
        </Route>
        <Route exact path="/register">
          <AuthLayout component={Register} />
        </Route>
        <Route exact path="/terms">
          <AuthLayout component={Terms} showHeader={true} />
        </Route>
      </Switch>
    </Router>
  );
}
}
export default App;
