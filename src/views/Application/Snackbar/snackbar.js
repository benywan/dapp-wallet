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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Snackbar as SnackbarMUI } from 'material-ui';
import { darkBlack, grey800 } from 'material-ui/styles/colors';

import { closeSnackbar } from '~/redux/providers/snackbarActions';

const bodyStyle = {
  backgroundColor: darkBlack,
  borderStyle: 'solid',
  borderColor: grey800,
  borderWidth: '1px 1px 0 1px',
  minWidth: 0
};

class Snackbar extends Component {
  static propTypes = {
    closeSnackbar: PropTypes.func.isRequired,

    open: PropTypes.bool,
    cooldown: PropTypes.number,
    message: PropTypes.any
  };

  render () {
    const { open, message, cooldown } = this.props;

    return (
      <SnackbarMUI
        open={ open }
        message={ message }
        autoHideDuration={ cooldown }
        bodyStyle={ bodyStyle }
        onRequestClose={ this.handleClose }
      />
    );
  }

  handleClose = () => {
    this.props.closeSnackbar();
  }
}

function mapStateToProps (state) {
  const { open, message, cooldown } = state.snackbar;

  return { open, message, cooldown };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    closeSnackbar
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snackbar);
