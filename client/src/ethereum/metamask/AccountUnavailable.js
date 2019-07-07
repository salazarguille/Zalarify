import React from 'react';
import PropTypes from 'prop-types';

import { MetamaskButton } from '.';

const AccountUnavailable = props => {
    return <MetamaskButton {...props} />;
};

AccountUnavailable.propTypes = {
    onClick: PropTypes.func
};

export default AccountUnavailable;
