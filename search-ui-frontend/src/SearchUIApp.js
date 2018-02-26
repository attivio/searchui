// @flow
import React from 'react';
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

export const mastheadTabInfo = [
  new NavTabInfo('Results', '/results'),
  new NavTabInfo('Insights', '/insights'),
];

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
      // If we get an exception, it should be in response to a field not existing...
      // we'll just return the original object and let the validation
      // code handle telling the user about it.
      console.log('Got an error converting the JSON configuration', exception);
    }
    return modified;
  }

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

  componentWillMount() {
    fetch('img/configuration.properties.js', { credentials: 'include' }).then((response) => {
      response.text().then((data) => {
        console.log('Got the JSON data back for the configuration');
        console.log(data);
        if (data) {
          // const strippedData = stripJsonComments(data);
          const jsonData = looseParseJson(data);
          console.log('Parsed the configuration');
          console.log(jsonData);
          const config = SearchUIApp.updateData(jsonData);
          console.log('Updated the configuration');
          console.log(config);
          this.setState({
            loading: false,
            config,
          }, () => {
            this.configureSuit();
          });
        }
      }).catch((error) => {
        this.setState({
          loading: false,
          configurationError: `Failed to load configuration.properties.json file: ${error}`,
        });
      });
    }, (error) => {
      this.setState({
        loading: false,
        configurationError: `Failed to load configuration.properties.json file: ${error}`,
      });
    });
    fetch('img/users.xml', { credentials: 'include' }).then((response) => {
      response.text().then((data) => {
        const users = xmlJs.xml2js(data, {
          compact: true,
          nativeType: true,
          trim: true,
          attributesKey: '$',
          ignoreDeclaration: true,
          ignoreInstruction: true,
          ignoreComment: true,
          ignoreDoctype: true,
        });

        if (users) {
          this.setState({
            loading: false,
            users,
          }, () => {
            this.configureSuit();
          });
        }
      }).catch((error) => {
        this.setState({
          loading: false,
          configurationError: `Failed to load users.json file: ${error}`,
        });
      });
    }, (error) => {
      this.setState({
        loading: false,
        configurationError: `Failed to load users.json file: ${error}`,
      });
    });
  }

  configureSuit() {
    if (this.state.users && this.state.config) {
      try {
        AuthUtils.configure(this.state.users, this.state.config);
        this.setState({
          configurationError: null,
        });
      } catch (exception) {
        this.setState({
          configurationError: exception,
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
*/
