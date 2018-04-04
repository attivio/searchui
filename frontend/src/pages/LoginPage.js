// @flow
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Redirect } from 'react-router-dom';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {
  AuthUtils,
  LoginForm,
  Masthead,
} from '@attivio/suit';

type LoginPageState = {
  loginError: string | null;
  redirectToReferrer: boolean;
};

/**
 * Page for logging in.
 */
export default class LoginPage extends React.Component<void, any, LoginPageState> {
  constructor(props: any) {
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


    // masheadTabInfo should not be visible during login
    // const mhTabInfo = this.props.searchEngineType === 'attivio' ? mastheadTabInfo : [];
    return (
      <DocumentTitle title="Login: Attivio Cognitive Search">
        <div>
          <Masthead applicationName="Cognitive Search" multiline homeRoute="/landing" />
          <Grid fluid>
            <Row>
              <Col xs={12} sm={12} md={8} lg={6} mdOffset={2} lgOffset={3}>
                <div style={{ display: 'inline-block', width: '50%', paddingBottom: '20px' }}>
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
      </DocumentTitle>
    );
  }
}
