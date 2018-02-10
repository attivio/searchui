// @flow
import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import 'whatwg-fetch';
import 'babel-polyfill';

import {
  Configuration,
  Searcher,
  AuthRoute,
  AuthUtils,
  Logger,
  NavTabInfo,
} from '@attivio/suit';

import SearchUILandingPage from './pages/SearchUILandingPage';
import SearchUIFakeLandingPage from './pages/SearchUIFakeLandingPage';
import SearchUISearchPage from './pages/SearchUISearchPage';
import SearchUIInsightsPage from './pages/SearchUIInsightsPage';
import Document360Page from './pages/Document360Page';
import SearchUIErrorPage from './pages/SearchUIErrorPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import config from './configuration.properties';
import users from './users.xml';

require('es6-object-assign').polyfill();
require('es6-promise').polyfill();

export const mastheadTabInfo = [
  new NavTabInfo('Results', '/results'),
  new NavTabInfo('Insights', '/insights'),
];

export default class App extends React.Component<void, {}, void> {
  componentWillMount() {
    AuthUtils.configure(users, config);
  }

  render() {
    return (
      <Configuration config={config}>
        <Logger />
        <DocumentTitle title="Attivio Cognitive Search">
          <Router basename={config.ALL.basename}>
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
