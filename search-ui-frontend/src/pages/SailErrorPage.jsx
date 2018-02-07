// @flow
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DocumentTitle from 'react-document-title';

import {
  Masthead,
  MastheadNavTabs,
} from '@attivio/suit';

import { mastheadTabInfo } from '../SailApp';

type SailErrorPageState = {
  numDocuments: number;
  numTables: number;
};

export default class SailErrorPage extends React.Component<void, {}, SailErrorPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numDocuments: 5024,
      numTables: 4,
    };
  }

  state: SailErrorPageState;

  render() {
    return (
      <DocumentTitle title="Error: Attivio Cognitive Search">
        <div>
          <Masthead multiline>
            <MastheadNavTabs tabInfo={mastheadTabInfo} />
          </Masthead>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    <h1>Error: unknown page</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}
