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

import { shallow } from 'enzyme';
import React from 'react';

import CompletedStep from './';

let component;

function render () {
  component = shallow(
    <CompletedStep
      store={ {
        depositInfo: { incomingCoin: 0.01, incomingType: 'BTC' },
        exchangeInfo: { outgoingCoin: 0.1, outgoingType: 'ETH' }
      } }
    />
  );

  return component;
}

describe('modals/Shapeshift/CompletedStep', () => {
  it('renders defaults', () => {
    expect(render()).to.be.ok;
  });
});
