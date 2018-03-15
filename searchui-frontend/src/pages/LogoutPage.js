// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import { Masthead } from '@attivio/suit';

type LogoutPageState = {
  logoutError: string | null;
};

/**
 * Page for logging in.
 */
class LogoutPage extends React.Component<void, any, LogoutPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      logoutError: null,
    };
    (this: any).doLogin = this.doLogin.bind(this);
  }

  state: LogoutPageState;

  doLogin() {
    // Send the user back to the landing page
    this.props.history.push('/');
  }

  render() {
    return (
      <DocumentTitle title="Logged Out: Attivio Cognitive Search">
        <div>
          <Masthead applicationName="Cognitive Search" multiline homeRoute="/landing" />
          <Grid fluid>
            <Row>
              <Col xs={12} sm={12} md={8} lg={6} mdOffset={2} lgOffset={3}>
                <div style={{ display: 'inline-block', width: '50%', paddingBottom: '20px' }}>
                  <h3>Log In</h3>
                  You have successfully logged out.
                </div>
                <div>
                  <Button onClick={this.doLogin}>
                    Log Back In
                  </Button>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

export default withRouter(LogoutPage);
