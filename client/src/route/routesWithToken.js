import React, {Component} from "react";
import {Router, Redirect, Switch, Route} from "react-router-dom";
import history from '../history';
import ValidateEmail from '../components/authentication/email/validation'
import Dashboard from '../components/dashboard/dashboard'
import Error from "../components/error";
import SignIn from "../components/authentication/signIn/signIn";
import SignUp from "../components/authentication/signUp/signUp";
import {ResendToken} from "../components/authentication/email/funtionality";
import MyProfile from "../components/myProfile/myProfile";
import Notice from "../components/notice";

export default class RoutesWithToken extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Redirect exact from="/" to="/signIn"/>
                    <Route path='/signIn' component={SignIn}/>
                    <Route path='/signUp' component={SignUp}/>
                    <Route path='/resendToken' component={ResendToken}/>
                    <Route path='/confirmation' component={ValidateEmail}/>
                    <Route path='/dashboard' component={Dashboard}/>
                    <Route path='/myProfile' component={MyProfile}/>
                    <Route path='/notification' component={Notice}/>
                    <Route component={Error}/>
                </Switch>
            </Router>
        )
    }
}
