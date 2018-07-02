// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DocumentTitle from 'react-document-title';

import {
  SimpleQueryRequest,
  QueryResponse,
  SearchBar,
  MastheadNavTabs,
  Masthead,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUILandingPageState = {
  numDocuments: number;
  numTables: number;
  loading: boolean;
  error: string | null;
};

export default class SearchUILandingPage extends React.Component<void, {}, SearchUILandingPageState> {
  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      numDocuments: 0,
      numTables: 0,
      loading: true,
      error: null,
    };
  }

  state: SearchUILandingPageState;

  componentDidMount() {
    const searcher = this.context.searcher;
    searcher.state.response = undefined;
    if (searcher) {
      const qr = new SimpleQueryRequest();
      qr.rows = 0;
      qr.facets = ['table'];
      searcher.doCustomSearch(qr, (response: QueryResponse | null, error: string | null) => {
        if (response) {
          const numDocuments = response.totalHits;
          let numTables = 0;
          if (response.facets &&
            response.facets.length === 1 &&
            response.facets[0].field === 'table' &&
            response.facets[0].buckets
          ) {
            numTables = response.facets[0].buckets.length;
          }
          this.setState({
            numDocuments,
            numTables,
            loading: false,
            error: null,
          });
        } else if (error) {
          this.setState({
            numDocuments: 0,
            numTables: 0,
            loading: false,
            error,
          });
        }
      });
    }
  }

  render() {
    let docs;
    switch (this.state.numDocuments) {
      case 0:
        docs = 'no documents';
        break;
      case 1:
        docs = 'one document';
        break;
      default:
        docs = `${this.state.numDocuments.toLocaleString()} documents`;
        break;
    }
    let sources;
    switch (this.state.numTables) {
      case 0:
        sources = 'no sources';
        break;
      case 1:
        sources = 'one source';
        break;
      default:
        sources = `${this.state.numTables} sources`;
        break;
    }

    if (this.context.searcher.search
      && this.context.searcher.search.searchEngineType
      && this.context.searcher.search.searchEngineType !== 'attivio'
    ) {
      sources = '1 source';
    }

    const indexStatusLabel = this.state.loading ? 'Analyzing your index\u2026' : `Searching across ${docs} from ${sources}.`;

    return (
      <DocumentTitle title="Attivio Cognitive Search">
        <div>
          <Masthead multiline homeRoute="/landing">
            <MastheadNavTabs initialTab="/" tabInfo={this.context.app.getMastheadNavTabs()} />
          </Masthead>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    <img src="img/attivio-logo.png" alt="Attivio" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div style={{ textAlign: 'center', paddingTop: '25px' }}>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    <SearchBar
                      allowLanguageSelect={false}
                      route="/results"
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div style={{ textAlign: 'center', paddingTop: '25px' }}>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    {indexStatusLabel}
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
