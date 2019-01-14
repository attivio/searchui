// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import SearchUIApp from './SearchUIApp';
import './style/main.less';

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(
    <SearchUIApp />,
    root,
  );
}
