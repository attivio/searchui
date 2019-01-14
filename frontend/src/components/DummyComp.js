// @flow

import React from 'react';

type DummyCompProps = {
  label: string;
  textColor: ?string;
};

export default class DummyComp extends React.Component<DummyCompProps> {
  static defaultProps = {
    textColor: 'goldenrod',
  };

  static displayName = 'DummyComp';

  render() {
    return (
      <div style={{
        backgroundColor: 'lightyellow',
        border: '2px solid goldenrod',
        color: this.props.textColor,
        fontSize: '36px',
        padding: '15px',
      }}
      >
        {this.props.label}
      </div>
    );
  }
}
