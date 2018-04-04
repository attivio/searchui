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
  Configuration,
  Searcher,
  AuthRoute,
  AuthUtils,
  Logger,
  NavTabInfo,
  ObjectUtils,
} from '@attivio/suit';

import SearchUILandingPage from './pages/SearchUILandingPage';
import SearchUIFakeLandingPage from './pages/SearchUIFakeLandingPage';
import SearchUISearchPage from './pages/SearchUISearchPage';
import SearchUIInsightsPage from './pages/SearchUIInsightsPage';
import Document360Page from './pages/Document360Page';
import SearchUIErrorPage from './pages/SearchUIErrorPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';

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
    '/login',
    '/loggedout',
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
  }

  state: SearchUIAppState;

  getChildContext() {
    return {
      app: this,
    };
  }

  componentWillMount() {
    fetch(`${SearchUIApp.getBasePath()}/configuration`, { credentials: 'include' }).then((response) => {
      response.text().then((rawData) => {
        let data = rawData;
        if (rawData.startsWith('"') && rawData.endsWith('"')) {
          data = JSON.parse(rawData);
        }
        // const strippedData = stripJsonComments(data);
        const jsonData = looseParseJson(data);
        const config = SearchUIApp.updateData(jsonData);
        this.setState({
          config,
        }, () => {
          this.configureSuit();
        });
      }).catch((error) => {
        this.setState({
          loading: false,
          configurationError: `Failed to load the configuration properties. Make sure you have the configuration.properties.js file in the configured location. ${error}`, // eslint-disable-line max-len
        });
      });
    }, (error) => {
      this.setState({
        loading: false,
        configurationError: `Failed to load the configuration properties. Make sure you have the configuration.properties.js file in the configured location. ${error}`, // eslint-disable-line max-len
      });
    });
    fetch(`${SearchUIApp.getBasePath()}/users`, { credentials: 'include' }).then((response) => {
      response.text().then((rawData) => {
        let data = rawData;
        if (rawData.startsWith('"') && rawData.endsWith('"')) {
          data = JSON.parse(rawData);
        }
        let users = {};

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

        this.setState({
          users,
        }, () => {
          this.configureSuit();
        });
      }).catch((error) => {
        this.setState({
          loading: false,
          configurationError: `Failed to load user configuration for XML authentication: ${error}`,
        });
      });
    }, (error) => {
      this.setState({
        loading: false,
        configurationError: `Failed to load user configuration for XML authentication: ${error}`,
      });
    });
  }

  getMastheadNavTabs(): Array<NavTabInfo> {
    if (this.state.config.searchEngineTypen && this.state.config.searchEngineType !== 'attivio') {
      return [];
    }
    return [
      new NavTabInfo('Results', '/results'),
      new NavTabInfo('Insights', '/insights'),
    ];
  }

  configureSuit() {
    if (this.state.users && this.state.config) {
      try {
        AuthUtils.configure(this.state.users, this.state.config);
        this.setState({
          configurationError: null,
          loading: false,
        });
      } catch (exception) {
        this.setState({
          configurationError: exception,
          loading: false,
        });
      }
    }
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

    return (
      <Configuration config={this.state.config}>
        <Logger />
        <DocumentTitle title="Attivio Cognitive Search">
          <Router basename={this.state.config.ALL.basename}>
            <Searcher>
              <Switch>
                <AuthRoute exact path="/" component={SearchUILandingPage} />
                <AuthRoute exact path="/landing" component={SearchUIFakeLandingPage} />
                <AuthRoute exact path="/results" component={SearchUISearchPage} />
                <AuthRoute exact path="/insights" component={SearchUIInsightsPage} />
                <AuthRoute exact path="/doc360" component={Document360Page} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/loggedout" component={LogoutPage} />
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
      </Switch>
    </div>
  </Router>

  ALTERNATIVELY:
  You can use the <Configurable> component to allow your page to access
  properties present in the configuration.properties.js file. See the
  <Configurable> component's documentation for more details.
*/
