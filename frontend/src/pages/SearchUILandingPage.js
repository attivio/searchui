// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import {
  AuthUtils,
  Configurable,
  Masthead,
  MastheadNavTabs,
  QueryResponse,
  SearchBar,
  SimpleQueryRequest,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUILandingPageProps = {
  logoUri: string | null;
  logoWidth: string | null;
  logoHeight: string | null;
  logoAltText: string | null;
};

type SearchUILandingPageDefaultProps = {
  logoUri: string | null;
  logoWidth: string | null;
  logoHeight: string | null;
  logoAltText: string | null;
};

type SearchUILandingPageState = {
  numDocuments: number;
  numTables: number;
  loading: boolean;
  error: string | null;
};

class SearchUILandingPage extends React.Component<SearchUILandingPageDefaultProps, SearchUILandingPageProps, SearchUILandingPageState> { // eslint-disable-line max-len
  static defaultProps = {
    logoUri: null,
    logoWidth: null,
    logoHeight: null,
    logoAltText: null,
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  constructor(props: SearchUILandingPageProps, context: any) {
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
      qr.facets = ['table(maxNumBuckets=-1)'];
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

    const logoUri = this.props.logoUri ? this.props.logoUri : 'img/attivio-logo.png';
    const logoAltText = this.props.logoAltText ? this.props.logoAltText : 'Attivio';
    const logoStyle = {};
    if (this.props.logoWidth) {
      logoStyle.width = this.props.logoWidth;
    }
    if (this.props.logoHeight) {
      logoStyle.height = this.props.logoHeight;
    }

    return (
      <div>
        <Masthead multiline homeRoute="/landing" logoutFunction={AuthUtils.logout}>
          <MastheadNavTabs initialTab="/" tabInfo={this.context.app.getMastheadNavTabs()} />
        </Masthead>
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                  <img src={logoUri} alt={logoAltText} style={logoStyle} />
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
    );
  }
}

export default Configurable(SearchUILandingPage);
