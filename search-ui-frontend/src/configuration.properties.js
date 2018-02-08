import { ObjectUtils } from '@attivio/suit';

const baseUri = 'http://localhost:8080';

export default {
  /**
   * These properties are not specific to any page/component but may apply to any/all of them.
   */
  ALL: {
    // This is the prefix to use for routes in the application. For example, if it will
    // running under '/sail', you will want to set this value to '/sail' (note the leading slash
    // and lack of a trailing slash). For running directory at the root of the URL, simply set
    // this to '/'.
    basename: '/',
    // Set this to 'SAML' to enable SAML authentication from the front end (it must also be
    // enabled on the back end). Set to 'XML' to use the users.xml file to define users and use
    // the local login page to enter credentials. For demo or development purposes, you can set
    // this to 'NONE' to disable authentication altogether.
    authType: 'XML',

    // The location of the node through which to interact with Attivio
    baseUri,
    // A map of document fields to display labels to use as entity mappings
    // Note this should be obsolete once the display names are in the schema
    // for FactBook and we start querying the schema to get this map.
    entityFields: ObjectUtils.toMap({
      people: 'People',
      company: 'Companies',
      location: 'Locations',
      languages: 'Languages',
      // Factbook fields - uncomment lines below if factbook module has been included in your project
      // spokenLanguage: 'Spoken Languages',
      // resource: 'Resources',
      // climate: 'Climate',
      // ethnicity: 'Ethnicities',
      // country: 'Country',
      date: 'Date',
      keyphrases: 'Key Phrases',
    }),
    // Controls the colors used to show various entity types (the value can be any valid CSS color)
    entityColors: ObjectUtils.toMap({
      location: '#007dbc',
      company: '#ed7a23',
      people: '#fedd0e',
      product: '#db2e75',
      religion: '#ef8baa',
      jobtitle: '#fcb62c',
      phonenum: '#c32026',
      email: '#a04ba0',
      url: '#767676',
      utm: '#e6e6e6',
      time: '#934900',
      extracteddate: '#d3cba9',
      keyphrase: '#037f70',
      hashtags: '#0caa93',
      mentions: '#38e5cc',
      creditcard: '#1b7735',
      money: '#6fbe44',
      nationality: '#77d5f3',
      distance: '#075484',
      coordinate: '#caeefa',
    }),
    // The default comprehensive list of fields to include in search results
    fields: [
      '*',
    ],
    // The field containing the document's title
    title: 'title',
    // The field containing the document's URI
    uri: 'uri',
    // The field containing the document's table
    table: 'table',
    // The field containing the document's latitude
    latitude: 'latitude',
    // The field containing the document's longitude
    longitude: 'longitude',
    // The field containing the document's MIME type (used by the browser when downloading files)
    mimetype: 'mimetype',
    // The field containing the document's sourcepath (used by the browser when downloading files)
    sourcePath: 'sourcepath',
    // The field containing the URI to the document's preview image
    previewImageUri: 'img.uri.preview',
    // The field containing the URI to the document's thumbnail image
    thumbnailImageUri: 'img.uri.thumbnail',
    // The field containing the 'more like this' query for a document
    moreLikeThisQuery: 'morelikethisquery',
    // The field containing the document's teaser text
    // (the default SCOPETEASER expression enables scope highlighting on results)
    teaser: 'SCOPETEASER(text, fragment=true, numFragments=4, fragmentScope=sentence)',
    // The field containing the document's full text
    // (the default SCOPETEASER expression enables scope highlighting on results)
    text: 'SCOPETEASER(text, fragment=true, numFragments=1, fragmentSize=2147483647)',
    // The public key with which to connect to the mapbox public apis
    mapboxKey: '',
  },

  /**
   * These properties configure only the default values for properties of any Masthead component(s).
   * The Masthead typically appears at the top of the page and contains a logo image, a page title, navigation breadcrumbs, and a
   * search input.
   */
  Masthead: {
    // The location of the logo image to render on the left side of the masthead
    logoUri: 'img/attivio-logo-reverse.png',
    // The alt text for the logo.
    logoAlt: 'Attivio Home',
    // The route to navigate to when the user clicks the logo.
    homeRoute: '/',
    // The name of the application.
    applicationName: 'Cognitive Search',
  },

  /**
   * These properties configure only the default values for properties of any SearchBar component(s).
   * The SearchBar is the input dom element through which the user can type and enter queries.
   */
  SearchBar: {
    // The placeholder text to display when the input field is empty.
    placeholder: 'Search…',
    // The placeholder text to display when the input field is empty and the language is advanced.
    placeholderAdvanced: 'Enter an advanced query…',
    // If true, the "microphone" button is displayed beside the search bar and the user can use speech recognition to input the
    // query
    allowVoice: true,
    // Whether to show a toggle for simple/advanced language in the search bar
    allowLanguageSelect: true,
    autoCompleteUri: 'rest/autocompleteApi/richCgi/dictionaryProvider',
  },

  /**
   * These properties configure only the default values for properties of any Searcher component(s).
   * The Searcher is a simple interface used by all its children for any querying logic.
   */
  Searcher: {
    // The workflow to use for executing searches
    searchWorkflow: 'search',
    // The number of results to show per page
    resultsPerPage: 10,
    // An ordered list of facet requests to use for each query; facet expressions are also supported
    facets: [
      'position',
      'keyphrases(maxbuckets=15)',
      'table',
      'tags',
      'company',
      'people',
      'location',
      'date(sortby=VALUE,maxbuckets=60,dateIntervals=auto)',
    ],
    // The maximum number of facets the Facet Finder attempts to add to the query. Set this to 0 to turn off Facet Finder.
    facetFinderCount: 20,
    // Determines if primary results should be displayed as 'list', 'usercard', 'doccard', 'debug', or 'simple';
    format: 'list',
    // An optional filter to apply to all queries when using the advanced query language
    queryFilter: '',
    // The locale for queries; all linguistic processing is performed using this locale
    locale: '',
    // The name of the relevancy models to be able to switch between
    relevancyModels: [
      'default',
    ],
    // Highlight mode for the results of your query: 'on' enables highlighting
    // using your schema preferences and field expressions, 'off' disables
    // highlighting on the request, only highlighting field expressions specified, and
    // 'all' adds a teaser field expression to all your display fields when not in debug mode.
    highlightResults: 'all',
    // Determines how joined results are returned by the server, either as child
    // documents, or rolled up as a part of the parent/top level document. */
    joinRollupMode: 'tree',
    // The name of the Business Center profile to use for queries. If set, this will enable Profile level
    // campaigns and promotions.
    businessCenterProfile: 'Attivio',
  },

  /**
   * These properties configure only the default values for properties of any SailSearchPage component(s).
   * The SailSearchPage is the page that displays the results after executing a query.
   */
  SailSearchPage: {
    pieChartFacets: [ // The facet field names that should be displayed as pie charts
    ],
    barChartFacets: [ // The facet field names that should be displayed as bar charts
    ],
    columnChartFacets: [ // The facet field names that should be displayed as column charts
    ],
    barListFacets: [ // The facet field names that should be displayed as lists with bars
      'sentiment.score',
    ],
    tagCloudFacets: [ // The facet field names that should be displayed as tag clouds
      'keyphrases',
    ],
    timeSeriesFacets: [ // The facet field names that should be displayed as time series
      'date',
    ],
    sentimentFacets: [// The facet field names that should be displayed with a sentiment bar
      'sentiment',
    ],
    geoMapFacets: [ // The facet field names that should be displayed with a geographic map
      'position',
    ],
    // The maximum number of items to show in a facet. If there
    // are more than this many buckets for the facet, only this many, with
    // the highest counts, will be shown.
    maxFacetBuckets: 15,
    // An optional list of facet field names which will be used to determine
    // the order in which the facets are shown. Any facets not named here will
    // appear after the called-out ones, in the order they are in in the
    // response.facets array of the parent Searcher compoinent.
    orderHint: [
      'position',
      'keyphrases',
      'date',
      'table',
    ],
    showScores: false,
    // Whether or not to display a toggle for switching the search results to debug format.
    debugViewToggle: true,
    sortableFields: [ // The names of the fields to include in the sort menu.
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
  },

  /**
   * These properties configure only the default values for properties of any SailInsightsPage component(s).
   * The SailInsightsPage is the page providing insight over a full scope of documents and allowing the user to narrow that scope.
   */
  SailInsightsPage: {
    pieChartFacets: [ // The facet field names that should be displayed as pie charts
      'table',
    ],
    barChartFacets: [ // The facet field names that should be displayed as bar charts
    ],
    columnChartFacets: [ // The facet field names that should be displayed as column charts
    ],
    barListFacets: [ // The facet field names that should be displayed as lists with bars
      'sentiment.score',
    ],
    tagCloudFacets: [ // The facet field names that should be displayed as tag clouds
      'keyphrases',
    ],
    timeSeriesFacets: [ // The facet field names that should be displayed as time series
      'date',
    ],
    sentimentFacets: [// The facet field names that should be displayed with a sentiment bar
      'sentiment',
    ],
    geoMapFacets: [ // The facet field names that should be displayed with a geographic map
      'position',
    ],
    // The maximum number of items to show in a facet. If there
    // are more than this many buckets for the facet, only this many, with
    // the highest counts, will be shown.
    maxFacetBuckets: 15,
  },

  /**
   * These properties configure only the default values for properties of any Document360Page component(s).
   * The Document360Page is the page providing contextual insight of a single document.
   */
  Document360Page: {
    // Show the list of documents which are similar to the focused document on the 360 page
    showMoreLikeThisResults: true,
    // Link across these fields to other documents in the document 360 insight graph
    insightGraphLinkingFields: [
      'people',
      'company',
      'location',
      'author',
      'cc',
      'to',
      // Factbook fields - uncomment lines below if factbook module has been included in your project
      //'country',
      //'spokenlanguage',
      //'resource',
      //'climate',
      //'ethnicity',
    ],
    // The maximum number of linked documents to show per entity in the document 360 insight graph
    maxLinkedDocs: 3,
  },
};
