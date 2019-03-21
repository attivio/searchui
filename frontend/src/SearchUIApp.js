// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import xmlJs from 'xml-js';
import looseParseJson from 'loose-json';
import 'whatwg-fetch';
import 'babel-polyfill';

import {
  AuthRoute,
  AuthUtils,
  Configuration,
  Logger,
  MastheadNavTabs,
  ObjectUtils,
  Searcher,
} from '@attivio/suit';

import Document360Page from './pages/Document360Page';
import LoginPage from './pages/LoginPage';
import SearchUIErrorPage from './pages/SearchUIErrorPage';
import SearchUIFakeLandingPage from './pages/SearchUIFakeLandingPage';
import SearchUIInsightsPage from './pages/SearchUIInsightsPage';
import SearchUILandingPage from './pages/SearchUILandingPage';
import SearchUISearchPage from './pages/SearchUISearchPage';

require('es6-object-assign').polyfill();
require('es6-promise').polyfill();

type SearchUIAppState = {
  config: any;
  users: any;
  loading: boolean;
  configurationError: string | null;
};

/**
 * This is the outermost component for the application.
 * IMPORTANT—when adding additional routes to
 * the application, be sure to add them to the application.properties file
 * and/or the searchui-servlet.xml file in the searchui-servlet and
 * searchui-module projects. If this isn’t done, the user will see
 * 404 errors when trying to directly access these routes from their
 * browser’s address bar.
 */
export default class SearchUIApp extends React.Component<void, {}, SearchUIAppState> {
  /**
   * Make sure any values that are supposed to be Maps are, in fact, maps...
   */
  static updateData(original: any): any {
    const modified = Object.assign({}, original);
    try {
      modified.ALL.entityFields = ObjectUtils.toMap(original.ALL.entityFields);
      modified.ALL.entityColors = ObjectUtils.toMap(original.ALL.entityColors);
    } catch (exception) {
      // If we get an exception, it will be in response to a field not existing...
      // we'll just return the original object and let the validation
      // code handle telling the user about it.
    }
    return modified;
  }

  // These are the routes we know about. This is used to help determine
  // the base path to use when loading the configuration files. If you
  // add or remove routes, you need to update this list.
  static knownRoutes = [
    '/',
    '/landing',
    '/results',
    '/insights',
    '/doc360',
    '/locallogin',
    '/error',
  ];

  /**
   * Convert the URL of the current page to be a base
   * path so we can get the configuration files before
   * we officially know what the server is. Will return
   * the first segment of the URL if there is one, or,
   * if not, then will return just the slash.
   * NOTE: This will not work properly if the servlet's
   * context path is more than one level deep.
   */
  static getBasePath(): string {
    let path = window.location.pathname;
    // Make sure it starts with a slash
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    // Find the next slash, if any
    const slashIndex = path.indexOf('/', 1);
    if (slashIndex >= 0) {
      // Remove anything after (and including) the second slash
      path = path.substring(0, slashIndex);
    }
    // Check to see if the first segment we found is one of
    // the known routes we expect. In this case, we assume
    // It's not part of the base path and return / instead.
    if (SearchUIApp.knownRoutes.find((route) => {
      return route === path;
    })) {
      path = '/';
    }
    return path;
  }

  static loadConfig(url: string, callback: (data: string | null, error: string | null) => void) {
    fetch(`${SearchUIApp.getBasePath()}/${url}`, { credentials: 'include' }).then((response) => {
      response.text().then((rawData) => {
        if (rawData.startsWith('<html') && rawData.includes('j_security_check')) {
          // We're not logged in yet... let's redirect to the login page
          callback(null, 'Not yet logged in.');
        } else {
          let data = rawData;
          // Account for case where the data comes quoted...
          if (rawData.startsWith('"') && rawData.endsWith('"')) {
            data = JSON.parse(rawData);
          }
          callback(data, null);
        }
      }, (error) => {
        callback(null, error.toString());
      });
    });
  }

  static childContextTypes = {
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      config: null,
      users: null,
      loading: true,
      configurationError: null,
    };
    (this: any).configureSuit = this.configureSuit.bind(this);
  }

  state: SearchUIAppState;

  getChildContext() {
    return {
      app: this,
    };
  }

  componentWillMount() {
    SearchUIApp.loadConfig('configuration', (data: string | null, error: string | null) => {
      if (data) {
        try {
          const jsonData = looseParseJson(data);
          // Handle any map massaging...
          const config = SearchUIApp.updateData(jsonData);
          this.updateState(config, null, null);
        } catch (parsingError) {
          this.updateState(null, null, `Failed to parse the application\u2019s configuration data: ${parsingError}`);
        }
      } else {
        let message;
        if (error) {
          message = `Failed to load the application\u2019s configuration data: ${error}`;
        } else {
          message = 'Failed to load the application\u2019s configuration data.';
        }
        this.updateState(null, null, message);
      }
    });
    SearchUIApp.loadConfig('users', (data: string | null) => {
      // Users are not required so we set them to an empty object by default.
      // If there weas an error loading the users, we'll pretend there wasn't—
      // even if the server isn't sending us users, we don't care unless we're
      // configured for XML authentication and, in that case, the AuthUtils.configure()
      // method will complain about that...
      let users = {};
      if (data) {
        if (data && data.length > 0) {
          users = xmlJs.xml2js(data, {
            compact: true,
            nativeType: true,
            trim: true,
            attributesKey: '$',
            ignoreDeclaration: true,
            ignoreInstruction: true,
            ignoreComment: true,
            ignoreDoctype: true,
          });
        }
      }
      this.updateState(null, users, null);
    });
  }

  getMastheadNavTabs(): Array<MastheadNavTabs.NavTabInfo> {
    if (this.state.config.searchEngineTypen && this.state.config.searchEngineType !== 'attivio') {
      return [];
    }
    return [
      new MastheadNavTabs.NavTabInfo('Results', '/results'),
      new MastheadNavTabs.NavTabInfo('Insights', '/insights'),
    ];
  }

  configureSuit() {
    if (this.state.loading) {
      if (this.state.configurationError) {
        this.setState({
          loading: false,
        });
      } else if (this.state.users && this.state.config) {
        const configurationError = AuthUtils.configure(this.state.users, this.state.config);
        const newState = {};
        newState.loading = false;
        if (configurationError) {
          newState.configurationError = configurationError;
        }
        this.setState(newState);
      }
    }
  }

  updateState(config: any, users: any, configurationError: string | null) {
    const newState = {};
    if (config !== null) {
      newState.config = config;
    }
    if (users !== null) {
      newState.users = users;
    }
    if (configurationError !== null) {
      newState.configurationError = configurationError;
    }
    this.setState(newState, this.configureSuit);
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h2>Loading{'\u2026'}</h2>
          <p>
            <img src="img/spinner.gif" alt="Loading" />
          </p>
        </div>
      );
    } else if (this.state.configurationError) {
      return (
        <div>
          <h2>Configuration Error</h2>
          <p>
            {this.state.configurationError.toString()}
          </p>
        </div>
      );
    }

    let pageTitle = 'Attivio Search UI';
    if (this.state.config && this.state.config.SearchUIApp && this.state.config.SearchUIApp.pageTitle) {
      pageTitle = this.state.config.SearchUIApp.pageTitle;
    }

    return (
      <Configuration config={this.state.config}>
        <Logger />
        <DocumentTitle title={pageTitle}>
          <Router basename={this.state.config.ALL.basename}>
            <Searcher>
              <Switch>
                <AuthRoute exact path="/" component={SearchUILandingPage} />
                <AuthRoute exact path="/landing" component={SearchUIFakeLandingPage} />
                <AuthRoute exact path="/results" component={SearchUISearchPage} />
                <AuthRoute exact path="/insights" component={SearchUIInsightsPage} />
                <AuthRoute exact path="/doc360" component={Document360Page} />
                <Route exact path="/locallogin" component={LoginPage} />
                <Route exact path="/error" component={SearchUIErrorPage} />
                <Route path="*" component={SearchUIErrorPage} />
              </Switch>
            </Searcher>
          </Router>
        </DocumentTitle>
      </Configuration>
    );
  }
}

/*
NOTE:
In case you need to add pages with properties (such as
the example MyProductPage below for which you must
set the "toggleSidebarOn" property), you need
to create a function that returns a component bound to
the properties you want:

  const MyProductPage = (props) => {
    return (
      <ProductPage
        toggleSidebarOn={this.toggleSidebarOn.bind(this)}
        {...props}
      />
    );
  }

And then pass that function via the "render" property of the
<Route> tag instead of via the "component" property used by
other pages like the PerspectivePage below:

  <Router>
    <div>
      <Switch>
        <Route exact path="/products" render={MyProductPage} />
        <Route exact path="/perspectives" component={PerspectivePage}/>
        <Route component={NotFound}/>
      </Switch
    </div>
  </Router>

  ALTERNATIVELY:
  You can use the <Configurable> component to allow your page to access
  properties present in the configuration.properties.js file. See the
  <Configurable> component's documentation for more details.
*/
