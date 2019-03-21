// @flow
import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import {
  AuthUtils,
  Configurable,
  FacetResults,
  Masthead,
  MastheadNavTabs,
  NavbarSort,
  PlacementResults,
  SearchBar,
  SearchDebugToggle,
  SearchRelevancyModel,
  SearchResults,
  SearchResultsCount,
  SearchResultsFacetFilters,
  SearchResultsPager,
  SecondaryNavBar,
  SpellCheckMessage,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUISearchPageProps = {
  /**
   * Optional. The location of the node through which to interact with Attivio.
   * Defaults to the value in the configuration.
   */
  baseUri: string;

  /**
   * The list of relevancy models to show that will be available for the user
   * to choose from. If this is set to a single-element array, then that one
   * relevancy model will be used for all queries and the user will not see
   * a menu for choosing the model. If this is not set (and the value is the
   * default, empty array, then the back-end will be queried to obtain the list
   * of known model names.
   */
  relevancyModels: Array<string>;

  /**
   * Whether or not the documents’ relevancy scores should be displayed.
   * Defaults to false.
   */
  showScores: boolean;
  /**
   * A map of the field names to the label to use for any entity fields.
   * Defaults to show the people, locations, and companies entities.
   */
  entityFields: Map<string, string>;
  /**
   * Whether or not to display a toggle for switching the search results
   * to debug format.
   */
  debugViewToggle: boolean;
  /** The names of the fields to include in the sort menu. */
  sortableFields: Array<string>;
  /** The facet field names that should be displayed as pie charts */
  pieChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as bar charts */
  barChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as column charts */
  columnChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as lists with bars */
  barListFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as tag clouds */
  tagCloudFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as time series */
  timeSeriesFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a sentiment bar */
  sentimentFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a geographic map */
  geoMapFacets: Array<string> | string | null;
  /**
   * The maximum number of items to show in a facet. If there
   * are more than this many buckets for the facet, only this many, with
   * the highest counts, will be shown. Defaults to 15.
   */
  maxFacetBuckets: number;
  /**
   * An optional list of facet field names which will be used to determine
   * the order in which the facets are shown. Any facets not named here will
   * appear after the called-out ones, in the order they are in in the
   * response.facets array of the parent Searcher component.
   */
  orderHint: Array<string>;
  /** Controls the colors used to show various entity types (the value can be any valid CSS color) */
  entityColors: Map<string, string>;
  /**
   * The type of engine being used to do the searching. This will affect the way the
   * search results are rendered.
   */
  searchEngineType: 'attivio' | 'solr' | 'elastic';
};

/**
 * Page for doing a simple search using a <Searcher> component.
 */
class SearchUISearchPage extends React.Component<SearchUISearchPageProps, SearchUISearchPageProps, void> {
  static defaultProps = {
    baseUri: '',
    searchEngineType: 'attivio',
    relevancyModels: [],
    showScores: false,
    entityFields: new Map([['people', 'People'], ['locations', 'Locations'], ['companies', 'Companies']]),
    debugViewToggle: false,
    sortableFields: [
      'title',
      'table',
      'size',
      'creationdate',
      'date',
      'guid',
      'linkcount',
      'socialsecurity',
      'zipcode',
    ],
    pieChartFacets: null,
    barChartFacets: null,
    columnChartFacets: null,
    barListFacets: null,
    tagCloudFacets: null,
    timeSeriesFacets: null,
    sentimentFacets: null,
    geoMapFacets: null,
    maxFacetBuckets: 15,
    orderHint: [],
    entityColors: new Map(),
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  componentWillMount() {
    this.context.searcher.doSearch();
  }

  renderSecondaryNavBar() {
    return (
      <SecondaryNavBar>
        <SearchResultsCount />
        <SearchResultsFacetFilters />
        <SearchResultsPager right />
        <SearchRelevancyModel
          right
          baseUri={this.props.baseUri}
          models={this.props.relevancyModels}
        />
        <NavbarSort
          fieldNames={this.props.sortableFields}
          includeRelevancy
          right
        />
        <SearchDebugToggle right />
      </SecondaryNavBar>
    );
  }

  render() {
    const showScores = this.props.showScores && this.props.searchEngineType === 'attivio';
    const showTags = this.props.searchEngineType === 'attivio';
    return (
      <div>
        <Masthead multiline homeRoute="/landing" logoutFunction={AuthUtils.logout}>
          <MastheadNavTabs initialTab="/results" tabInfo={this.context.app.getMastheadNavTabs()} />
          <SearchBar
            inMasthead
          />
        </Masthead>
        {this.renderSecondaryNavBar()}
        <div style={{ padding: '10px' }}>
          <Grid fluid>
            <Row>
              <Col xs={12} sm={5} md={4} lg={3}>
                <FacetResults
                  pieChartFacets={this.props.pieChartFacets}
                  barChartFacets={this.props.barChartFacets}
                  columnChartFacets={this.props.columnChartFacets}
                  barListFacets={this.props.barListFacets}
                  tagCloudFacets={this.props.tagCloudFacets}
                  timeSeriesFacets={this.props.timeSeriesFacets}
                  sentimentFacets={this.props.sentimentFacets}
                  geoMapFacets={this.props.geoMapFacets}
                  maxFacetBuckets={this.props.maxFacetBuckets}
                  orderHint={this.props.orderHint}
                  entityColors={this.props.entityColors}
                />
              </Col>
              <Col xs={12} sm={7} md={8} lg={9}>
                <PlacementResults />
                <SpellCheckMessage />
                <SearchResults
                  format={this.context.searcher.state.format}
                  entityFields={this.props.entityFields}
                  baseUri={this.props.baseUri}
                  showScores={showScores}
                  showTags={showTags}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Configurable(SearchUISearchPage);
