// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import {
  AuthUtils,
  Configurable,
  LoginForm,
  Masthead,
} from '@attivio/suit';

type LoginPageProps = {
  location: PropTypes.object.isRequired;
};

type LoginPageState = {
  loginError: string | null;
  redirectToReferrer: boolean;
};

/**
 * Page for logging in.
 */
class LoginPage extends React.Component<void, LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      loginError: null,
      redirectToReferrer: false,
    };
    (this: any).doLogin = this.doLogin.bind(this);
  }

  state: LoginPageState;

  doLogin(username: string, password: string) {
    const loginError = AuthUtils.login(username, password);
    const loginErrorString = loginError ? loginError.message : null;
    this.setState({
      loginError: loginErrorString,
      redirectToReferrer: loginError === null,
    });
  }

  render() {
    if (this.state.redirectToReferrer) {
      let from;
      if (this.props.location.state && this.props.location.state.referrer) {
        from = this.props.location.state.referrer;
      } else {
        from = { pathname: '/' };
      }
      return <Redirect to={from} />;
    }

    // If we came here because we logged out, then the action URL parameter will be set to
    // "logout" and we'll display a message about that
    const loggedOut = this.props.location && this.props.location.search && this.props.location.search.includes('action=logout');
    const loggedOutMessage = loggedOut ? (
      <div style={{ width: '100%', borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
        <h3>Logged Out</h3>
        You have been successfully logged out.
      </div>
    ) : null;

    return (
      <div>
        <Masthead multiline homeRoute="/landing" />
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={8} lg={6} mdOffset={2} lgOffset={3}>
              <div style={{ display: 'inline-block', width: '50%', paddingBottom: '20px' }}>
                {loggedOutMessage}
                <h3>Log In</h3>
                Enter your log-in credentials to search the Attivio index:
              </div>
              <LoginForm
                doLogin={this.doLogin}
                error={this.state.loginError}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Configurable(LoginPage));
