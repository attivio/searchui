// @flow
import React from 'react';
import PropTypes from 'prop-types';

import {
  AuthUtils,
  Configurable,
  FacetInsights,
  Masthead,
  MastheadNavTabs,
  SearchBar,
  SearchResultsCount,
  SearchResultsFacetFilters,
  SecondaryNavBar,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUIInsightsPageProps = {
  location: PropTypes.object.isRequired;
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
   * the highest counts, will be shown.
   */
  maxFacetBuckets: number;
  /** Controls the colors used to show various entity types (the value can be any valid CSS color) */
  entityColors: Map<string, string>;
};

class SearchUIInsightsPage extends React.Component<SearchUIInsightsPageProps, SearchUIInsightsPageProps, void> {
  static contextTypes = {
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  static defaultProps = {
    location: null,
    pieChartFacets: null,
    barChartFacets: null,
    columnChartFacets: null,
    barListFacets: null,
    tagCloudFacets: null,
    timeSeriesFacets: null,
    sentimentFacets: null,
    geoMapFacets: null,
    maxFacetBuckets: 15,
    entityColors: new Map(),
  };

  render() {
    const simple = this.props.location && this.props.location.pathname.includes('/no-mast');
    return (
      <div>
        <Masthead multiline simple={simple} homeRoute="/landing" logoutFunction={AuthUtils.logout}>
          <MastheadNavTabs initialTab="/insights" tabInfo={this.context.app.getMastheadNavTabs()} />
          <SearchBar
            inMasthead
          />
        </Masthead>
        <SecondaryNavBar>
          <SearchResultsCount />
          <SearchResultsFacetFilters />
        </SecondaryNavBar>
        <div style={{ padding: '10px' }}>
          <FacetInsights
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

export default Configurable(SearchUIInsightsPage);
