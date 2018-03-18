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

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RpcNav.css';

export default class RpcNav extends Component {
  render () {
    return (
      <div className={ styles.nav }>
        <Link to={ '/rpc/calls' } activeClassName={ styles.activeNav } { ...this._test('rpc-calls-link') }>
          <i className='icon-call-out' />
        </Link>
        <Link to={ '/rpc/docs' } activeClassName={ styles.activeNav } { ...this._test('rpc-docs-link') }>
          <i className='icon-docs' />
        </Link>
      </div>
    );
  }
}
