// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component, PropTypes } from 'react';

import Actionbar from '../Actionbar';
import { nodeOrStringProptype } from '~/util/proptypes';

import styles from './page.css';

export default class Page extends Component {
  static propTypes = {
    buttons: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.node,
    padded: PropTypes.bool,
    title: nodeOrStringProptype()
  };

  render () {
    const { buttons, className, children, padded, title } = this.props;

    return (
      <div>
        {
          title || buttons
            ? (
              <Actionbar
                buttons={ buttons }
                title={ title }
              />
            )
            : null
        }
        <div
          className={
            [
              padded
                ? styles.layoutPadded
                : styles.layout,
              className
            ].join(' ')
          }
        >
          { children }
        </div>
      </div>
    );
  }
}
