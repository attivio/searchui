// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Searcher } from '@attivio/suit';

class SailFakeLandingPage extends React.Component<void, {}, void> {
  static contextTypes = {
    searcher: PropTypes.instanceOf(Searcher),
    router: PropTypes.any,
  };

  componentDidMount() {
    const searcher = this.context.searcher;
    const router = this.context.router;
    if (searcher && router) {
      searcher.reset(() => {
        router.history.replace('/'); // Navigate to the real landing page after the reset
      });
    }
  }

  render() {
    return null;
  }
}

export default withRouter(SailFakeLandingPage);
