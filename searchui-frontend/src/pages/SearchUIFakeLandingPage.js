// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class SearchUIFakeLandingPage extends React.Component<void, {}, void> {
  static contextTypes = {
    searcher: PropTypes.any,
    router: PropTypes.any,
  };

  componentDidMount() {
    const searcher = this.context.searcher;
    const router = this.context.router;
    if (searcher && router) {
      searcher.reset(() => {
        const newQueryString = searcher.generateLocationQueryStringFromState(searcher.state);
        router.history.replace('/', { query: newQueryString }); // Navigate to the real landing page after the reset
      });
    }
  }

  render() {
    return null;
  }
}

export default withRouter(SearchUIFakeLandingPage);
