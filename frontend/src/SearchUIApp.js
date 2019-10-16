// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import 'whatwg-fetch';
import 'core-js';
import 'es6-promise';

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

import ConfigurationApi from './api/ConfigurationApi';
import UsersApi from './api/UsersApi';

type SearchUIAppState = {
  config: any;
  configurationError: string | null;
  loading: boolean;
  users: any;
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

  static childContextTypes = {
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };

  state: SearchUIAppState = {
    config: null,
    configurationError: null,
    loading: true,
    users: null,
  };

  getChildContext() {
    return {
      app: this,
    };
  }

  componentDidMount() {
    ConfigurationApi.getConfiguration().then((data: string | null) => {
      // Handle any map massaging...
      const config = SearchUIApp.updateData(data);
      this.updateState(config, null, null);
    }, (parsingError: string | null) => {
      this.updateState(null, null, `Failed to parse the application\u2019s configuration data: ${parsingError}`);
    });
    UsersApi.getUsers().then((users: Array<string>) => {
      console.group('<SearchUIApp />');
      console.log('users: ', users);
      console.groupEnd();
      this.updateState(null, users, null);
    });
  }

  getMastheadNavTabs(): Array<MastheadNavTabs.NavTabInfo> {
    const { config } = this.state;
    if ((config !== null && config.searchEngineType && config.searchEngineType !== 'attivio')
      || !config || !config.searchEngineType
    ) {
      return [];
    }
    return [
      new MastheadNavTabs.NavTabInfo('Results', '/results'),
      new MastheadNavTabs.NavTabInfo('Insights', '/insights'),
    ];
  }

  configureSuit() {
    const {
      loading,
      configurationError,
      config,
      users,
    } = this.state;
    if (loading) {
      if (configurationError) {
        this.setState({
          loading: false,
        });
      } else if (config !== null) {
        const configurationError = users && users.length > 0
          ? AuthUtils.configure(users, config)
          : AuthUtils.configure(null, config, true);

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
    const {
      config,
      configurationError,
      loading,
    } = this.state;

    if (loading) {
      return (
        <div>
          <h2>Loading{'\u2026'}</h2>
          <p>
            <img src="img/spinner.gif" alt="Loading" />
          </p>
        </div>
      );
    } else if (configurationError) {
      return (
        <div>
          <h2>Configuration Error</h2>
          <p>
            {configurationError.toString() || 'An Unexpected Error occurred'}
          </p>
        </div>
      );
    }

    const useConfigTitle = config && config.SearchUIApp && config.SearchUIApp.pageTitle;
    const pageTitle = useConfigTitle ? config.SearchUIApp.pageTitle : 'Attivio Search UI';

    return (
      <Configuration config={config}>
        <Logger />
        <DocumentTitle title={pageTitle}>
          <Router basename={config.ALL.basename}>
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
