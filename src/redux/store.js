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

import { applyMiddleware, createStore } from 'redux';

import initMiddleware from './middleware';
import initReducers from './reducers';

import { load as loadWallet } from './providers/walletActions';
import { init as initRequests } from './providers/requestsActions';
import { setupWorker } from './providers/workerWrapper';
import { setApi } from './providers/apiActions';

import {
  Balances as BalancesProvider,
  Personal as PersonalProvider,
  Signer as SignerProvider,
  Status as StatusProvider,
  Tokens as TokensProvider
} from './providers';

const storeCreation = window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore;

export default function (api, browserHistory, forEmbed = false) {
  const reducers = initReducers();
  const middleware = initMiddleware(api, browserHistory, forEmbed);
  const store = applyMiddleware(...middleware)(storeCreation)(reducers);

  // Add the `api` to the Redux Store
  store.dispatch({ type: 'initAll', api });
  store.dispatch(setApi(api));

  // Initialise the Store Providers
  BalancesProvider.init(store);
  PersonalProvider.init(store);
  StatusProvider.init(store);
  TokensProvider.init(store);

  new SignerProvider(store, api).start();

  store.dispatch(loadWallet(api));
  store.dispatch(initRequests(api));
  setupWorker(store);

  const start = () => {
    return Promise
      .resolve()
      .then(() => console.log('v1: starting Status Provider...'))
      .then(() => StatusProvider.start())
      .then(() => console.log('v1: started Status Provider'))

      .then(() => console.log('v1: starting Personal Provider...'))
      .then(() => withTimeoutForLight('personal', PersonalProvider.start(), store))
      .then(() => console.log('v1: started Personal Provider'))

      .then(() => console.log('v1: starting Balances Provider...'))
      .then(() => withTimeoutForLight('balances', BalancesProvider.start(), store))
      .then(() => console.log('v1: started Balances Provider'))

      .then(() => console.log('v1: starting Tokens Provider...'))
      .then(() => withTimeoutForLight('tokens', TokensProvider.start(), store))
      .then(() => console.log('v1: started Tokens Provider'));
  };

  const stop = () => {
    return StatusProvider
      .stop()
      .then(() => PersonalProvider.stop())
      .then(() => TokensProvider.stop())
      .then(() => BalancesProvider.stop());
  };

  // On connected, start the subscriptions
  api.on('connected', start);

  // On disconnected, stop all subscriptions
  api.on('disconnected', stop);

  if (api.isConnected) {
    start();
  }

  return store;
}

function withTimeoutForLight (id, promise, store) {
  const { nodeKind } = store.getState().nodeStatus;
  const isLightNode = nodeKind.capability !== 'full';

  if (!isLightNode) {
    // make sure that no values are passed
    return promise.then(() => {});
  }

  return new Promise((resolve, reject) => {
    let isResolved = false;
    const doResolve = () => {
      if (!isResolved) {
        isResolved = true;
        resolve();
      }
    };
    const timeout = setTimeout(() => {
      console.warn(`Resolving ${id} by timeout.`);
      doResolve();
    }, 1000);

    promise
      .then(() => {
        clearTimeout(timeout);
        doResolve();
      })
      .catch(err => {
        clearTimeout(timeout);
        if (!isResolved) {
          reject(err);
        }
      });
  });
}
