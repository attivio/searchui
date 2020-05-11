// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import {
  AuthUtils,
  Configurable,
  FacetResults,
  Masthead,
  MastheadNavTabs,
  NavbarProfileSelector,
  NavbarWorkflowSelector,
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
  /**
   * location object injected by withRouter.
   */
  location: {};
  /** List of profiles to populate the profile dropdown with */
  profiles: Array<string>;
  /** List of workflows to use for executing the query */
  searchWorkflows: Array<string>;
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
    profiles: [],
    searchWorkflows: [],
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  componentDidMount() {
    const { searcher = null } = this.context;
    if (searcher) {
      searcher.doSearch();
    }
  }

  renderSecondaryNavBar(hideMasthead: boolean) {
    const {
      baseUri,
      relevancyModels,
      sortableFields,
      profiles,
      searchWorkflows,
    } = this.props;

    const profileSelectorComp = profiles && profiles.length > 0 ?
      <NavbarProfileSelector right profiles={profiles} /> : null;

    const workflowSelectorComp = searchWorkflows && searchWorkflows.length > 0 ?
      <NavbarWorkflowSelector right workflows={searchWorkflows} /> : null;

    return (
      <SecondaryNavBar>
        <SearchResultsCount />
        {hideMasthead && <SearchBar />}
        <SearchResultsFacetFilters />
        <SearchResultsPager right />
        {profileSelectorComp}
        {workflowSelectorComp}
        <SearchRelevancyModel
          right
          baseUri={baseUri}
          models={relevancyModels}
        />
        <NavbarSort
          fieldNames={sortableFields}
          includeRelevancy
          right
        />
        <SearchDebugToggle right />
      </SecondaryNavBar>
    );
  }

  render() {
    const {
      barChartFacets,
      barListFacets,
      baseUri,
      columnChartFacets,
      entityColors,
      entityFields,
      geoMapFacets,
      location: {
        pathname,
      },
      maxFacetBuckets,
      orderHint,
      pieChartFacets,
      searchEngineType,
      sentimentFacets,
      showScores,
      tagCloudFacets,
      timeSeriesFacets,
    } = this.props;

    const { app = null, searcher = null } = this.context;

    const showTags = searchEngineType === 'attivio';
    const showScoresInSearchResults = showScores && showTags;

    const hideMasthead = pathname && pathname.includes('no-mast');

    return (
      <div>
        {!hideMasthead &&
          <Masthead multiline homeRoute="/landing" logoutFunction={AuthUtils.logout}>
            <MastheadNavTabs
              initialTab="/results"
              tabInfo={app ? app.getMastheadNavTabs() : []}
            />
            <SearchBar inMasthead />
          </Masthead>
        }
        {this.renderSecondaryNavBar(hideMasthead)}
        <div style={{ padding: '10px' }}>
          <Grid fluid>
            <Row>
              <Col xs={12} sm={5} md={4} lg={3}>
                <FacetResults
                  pieChartFacets={pieChartFacets}
                  barChartFacets={barChartFacets}
                  columnChartFacets={columnChartFacets}
                  barListFacets={barListFacets}
                  tagCloudFacets={tagCloudFacets}
                  timeSeriesFacets={timeSeriesFacets}
                  sentimentFacets={sentimentFacets}
                  geoMapFacets={geoMapFacets}
                  maxFacetBuckets={maxFacetBuckets}
                  orderHint={orderHint}
                  entityColors={entityColors}
                />
              </Col>
              <Col xs={12} sm={7} md={8} lg={9}>
                <PlacementResults />
                <SpellCheckMessage />
                <SearchResults
                  format={searcher && searcher.state ? searcher.state.format : null}
                  entityFields={entityFields}
                  baseUri={baseUri}
                  showScores={showScoresInSearchResults}
                  showTags={showTags}
                  hide360Link={hideMasthead}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(Configurable(SearchUISearchPage));
