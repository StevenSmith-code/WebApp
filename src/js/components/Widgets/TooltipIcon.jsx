import { Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from '@mui/material/styles/styled';


class TooltipIcon extends Component {
  render () {
    return (
      <Icon>
        <Tooltip
          title={this.props.title}
        >
          <Info />
        </Tooltip>
      </Icon>
    );
  }
}
TooltipIcon.propTypes = {
  title: PropTypes.string,
};

const Icon = styled('span')`
  position: relative;
  top: -2px;
  left: 4px;
  * {
    color: #999;
  }
`;

export default TooltipIcon;
