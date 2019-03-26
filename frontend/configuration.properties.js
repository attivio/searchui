{
  /**
   * These properties are not specific to any page/component but may apply to any/all of them.
   */
  ALL: {
    // Here we define the search engine type, which defaults to 'attivio'
    // for the Attivio platform. In addition, ElasticSearch (use the value 'elastic')
    // and Solr (use the value 'solr') are supported, with limited functionality.
    // If the searchEngineType property is set to "elastic" or "solr," then these additional
    // properties also need to be configured appropriately—see the comments for them for
    // details:
    //   - ALL.baseUri
    //   - ALL.customOptions
    //   - SearchUISearchPage.sortableFields
    searchEngineType: 'attivio',

    // This is the base URI that will be used for making REST API calls to the
    // Attivio server. When running as a module within the Attivio node, this should
    // be the empty string (''). When running in the servlet, it should match the 
    // baseName property where the servlet is running relative to the machine (without
    // the hostname or port).

    // NOTE: if you are using 'elastic' or 'solr', the URI needs to point directly
    // to the collection/handler, for example:
    //   elastic:
    //   ** using the _search handler **
    //   baseUri: 'http://example.com:9200/mycollection/_search'
    //
    //   solr:
    //   **  using 'myHandler' handler **
    //   baseUri: 'http://example.com:8983/solr/mycollection/myHandler'
    // in the case of 'attivio', only the Attivio instance URI is needed.
    baseUri: '${searchui.baseUri}',

    // If searchEngineType is 'elastic' or 'solr', the property customOptions
    // needs to be added.

    // customOptions: {
    //
    //   customId: "id", // field to be used as id, in the case of elastic defaults to _id, in solr is mandatory.
    //   /**
    //    * The valid fields for mappings are:
    //    *  - title
    //    *  - uri
    //    *  - teaser
    //    *  - text
    //    *  - previewImageUri
    //    *  - thumbnailImageUri
    //    * The key is the field in the UI and the value is the name of the
    //    * field in the search engine (elastic or solr).
    //    * NOTE: Remember not to use fields containing object other than a array (1 dimension).
    //    */
    //   mappings: {
    //     title: "title_field",
    //     uri: "uri_field",
    //     teaser: "teaser_field",
    //     text: "text_field",
    //     previewImageUri: "previewImageUri_field",
    //     thumbnailImageUri: "thumbnailImageUri_field"
    //   },
    //   /**
    //    *  Facets contains a array of objects needed to render the Facets menu
    //    *  on the left side of the search screen.
    //    *  displayName: a name to display for those facets (for example 'People').
    //    *  field: the field used to build the facets on the search engine,
    //    *         NOTE: This field needs to be non-tokenized to work in solr
    //    *               So for example, if the collection contains a field of type textField (tokenized),
    //    *               this field needs to be copied to a strField (non-tokenized) to be displayed as Facet.
    //    */
    //   facets: [
    //     {
    //       displayName: "People",
    //       field: "people_str_field"
    //     },
    //     {
    //       displayName: "Places",
    //       field: "places_str_field"
    //     }
    //   ]
    // },

    // This is the prefix to use for routes in the application. For example, if it will be
    // running under '/searchui', you will want to set this value to '/searchui' (note the leading slash
    // and lack of a trailing slash). For running the application at the root of the baseUri,
    // simply set this to '/'. This may be the same as the baseUri.
    // The value here MUST match the server.contextPath in the application.properties file
    // used when running the servlet and/or the servlet name and mapping in the web.xml
    // file in the Attivio module. Finally, it must match the value of the prefix variable in
    // the webpack.config.js file.
    basename: '/searchui',

    // This specifies the type of authentication that the front-end application will use.
    // Set this to 'SAML' to enable SAML authentication when hosting the UI in a servlet
    // (SAML authentication must also be enabled on the back end, using the values in the
    // application.properties file).
    // Set this to 'NONE' if you will be hosting the UI in an Attivio module; in this case
    // the Deploy Webapp feature in the module will define the type of authentication that
    // will secure the UI. Note that you can also use 'NONE' during the course of developing
    // an application.
    // Set this to 'XML' to use the contents of the users.xml file to define users. In this
    // case, the front-end application's login page (defined by the loginPage property below)
    // will be used to log users in.
    // IMPORTANT: The XML-based authentication is only suitable for use in proof-of-concept
    // or development settings and should NEVER be used for a production system as it is
    // inherently insecure.
    authType: '${searchui.authType}',

    // If the authType property is set to XML, this must be set so that the SUIT library knows
    // where to redirect when the user has logged out. If the user logs out, then when this
    // redirection happens the page at this route will be passed a query parameter, "action,"
    // set to the value "logout" that can be used to show a message about having successfully
    // logged out. If authType is not XML, then this property is not used and doesn't need to
    // be set.
    loginPage: '/locallogin',


    // This is the default principal realm to use when searching.
    defaultRealm: 'aie',

    // A map of document fields to display labels to use as entity mappings
    // Note this should be obsolete once the display names are in the schema
    // for FactBook and we start querying the schema to get this map.
    entityFields: {
      people: 'People',
      company: 'Companies',
      location: 'Locations',
      languages: 'Languages',
      date: 'Date',
      keyphrases: 'Key Phrases',
      // Factbook fields: uncomment the following lines if the Factbook module has been included in your project
      // spokenLanguage: 'Spoken Languages',
      // resource: 'Resources',
      // climate: 'Climate',
      // ethnicity: 'Ethnicities',
      // country: 'Country',
    },

    // This map controls the colors used to show various entity types. The keys are the fields
    // used to contain entities and the values are the colors to use, in any valid CSS format (e.g.,
    // '#0074A3' or 'rgba(255, 42, 153, 0.5)').
    // This map is also used to control colors in various charts, such as pie chart facets. In this
    // case, the entity names are ignored and the colors are used in the order listed here, starting
    // with the first entry for the first data set in the chart.
    entityColors: {
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
    },

    // The default comprehensive list of fields to include in search results
    fields: [
      '*',
    ],

    // The properties in this group control how the fields in the index are
    // mapped to the fields that UI expects to see when queries are done.
    // If doing custom queries by constructing your own query request object,
    // you may want to call Searcher.getFieldList() to get the list of
    // aliased fields to include in the query request.
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
    // The field containing the document's source path (used by the browser when downloading files)
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
    // See https://www.mapbox.com/help/how-access-tokens-work/ for more information on how to acquire a public key
    mapboxKey: '',
  },

  // These properties configure the UI for the application as a whole.
  SearchUIApp: {
    // This is the title that is used for the browser windows/tabs throughout the Search UI app
    pageTitle: 'Attivio Search UI',
  },

  // These properties configure only the default values for properties of any Masthead component(s).
  // The Masthead typically appears at the top of the page and contains a logo image, a page title,
  // navigation breadcrumbs, and a search input field.
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

  // These properties configure only the default values for properties of any SearchBar components
  // that allow the user to enter their queries.
  SearchBar: {
    // The placeholder text to display when the input field is empty.
    placeholder: 'Search\u2026',
    // The placeholder text to display when the input field is empty and the language is advanced.
    placeholderAdvanced: 'Enter an advanced query\u2026',
    // If true, the "microphone" button is displayed beside the search bar and the user can use speech recognition to input the
    // query
    allowVoice: true,
    // Whether to show a toggle for simple/advanced language in the search bar
    allowLanguageSelect: true,
    autoCompleteUri: '/rest/autocompleteApi/richCgi/dictionaryProvider',
  },
  
  // These properties configure the default properties for FacetSearchBar components in the UI.
  // These allow searching among all values of a specific facet, as well as being able to export
  // the list of all values for that facet to a CSV file.
  FacetSearchBar: {
	// Whether the FacetSearchBar should be visible
	showSearchBar: false,
	// The placeholder text for the search bar
  placeholder: 'Search values\u2026',
	// The label on the 'Search' button
  buttonLabel: 'Search',
	// Max number of matching facet values to show
	maxValues: 5,
	// Whether there should be an export button
	showExportButton: false,
	// The label for the export button
	exportButtonLabel: 'Export',
  },

  // These properties configure the default values for properties of any Searcher components,
  // which are used by their child components to perform the searches of the index.
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
    // An optional filter to apply to all queries when using the advanced query language
    queryFilter: '',
    // The locale for queries; all linguistic processing is performed using this locale
    locale: '',
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
    businessCenterProfile: null,
    // Maximum times a query can be resubmitted, such as for And-to-Or resubmission
    maxResubmits: 1,
  },

  NavbarFilter: {
    // This is the maximum number of characters to display when showing hierarchical facets in
    // the NavbarFilter component. 0 means "no truncation." If set to non-zero value and
    // any of the segments in the hierarchical facet filter's name are longer than that many
    // characters, they will be truncated (with an ellipsis added to the segment name) and
    // a tooltip containing the full name will be added to the component.
    maxHierarchicalSegmentLength: 0,
  },

  // These properties configure the Search UI landing page.
  SearchUILandingPage: {
    // This is the path to the logo to use for the landing page. Leave unset/null to
    // use the default Attivio logo.
    logoUri: null,
    // These properties specify the width and height of the logo on the landing page.
    // They should be valid CSS dimension strings. Leave unset/null to use the default
    // size of the image.
    logoWidth: null,
    logoHeight: null,
    // This is the 'alt' text that is used for the logo. Leave unset/null to use the
    // default text ('Attivio').
    logoAltText: null,
  },

  // These properties configure the SearchUISearchPage which displays search results.
  SearchUISearchPage: {
    // The names of the relevancy models to be able to switch between. If this is an empty array,
    // the server will be queried for the list of available relevancy models and they will be used.
    // To force the UI to always use a single model when making queries, set this to an array with
    // that single name as its sole element.
    relevancyModels: [
    ],
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
    // response.facets array of the parent Searcher component.
    orderHint: [
      'position',
      'keyphrases',
      'date',
      'table',
    ],
    showScores: false,
    // Whether or not to display a toggle for switching the search results to debug format.
    debugViewToggle: true,
    // The names of the fields to include in the sort menu.
    // NOTE: if 'elastic' or 'solr' is being used, these fields need to be ones used in
    // customOptions.mappings, for example:
    // sortableFields: [
    //   'title',
    //   'teaser',
    //   'text'
    // ],
    // Sorting in 'elastic' or 'solr' doesn't support multi value fields.
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
  },

  // These properties configure the SearchUIInsightsPage, which displays facet information
  // about the current search terms to provide insight into the results and allow the user
  // to narrow the search's focus.
  SearchUIInsightsPage: {
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

  // These properties configure the Document360Page, which provides contextual insight for a single document.
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
      // 'country',
      // 'spokenlanguage',
      // 'resource',
      // 'climate',
      // 'ethnicity',
    ],
    // The maximum number of linked documents to show per entity in the document 360 insight graph
    maxLinkedDocs: 3,
    // If true, then the 360° page will show links to documents from any table. Set this to false to
    // only show links to documents that come from tables other than the one the main document is in.
    includeAllTables: false,
  },
}
