import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CampaignActions from '../../../actions/CampaignActions';
import DesignTokenColors from '../../Style/DesignTokenColors';
import numberWithCommas from '../../../utils/numberWithCommas';
import HeartFavoriteToggleIcon from './HeartFavoriteToggleIcon';


// WV-399: Creating popover for sign in prompt using MUI Popover component.
// Popover text passed into helper functions setting like/dislike text for handleActionClick.
// voterSignedInWithEmail in handleActionClick to update state for anchorEl and popoverText hooking into Like/Dislike containers.
// Conditional rendered Popover component with anchorEl and popoverText state.
// Styled Popover component to match design system.

const CustomPopoverPaper = styled('div')`
  background-color: #fff;
  color: #333;
  padding: 16px;
  max-width: 300px;

  .MuiTypography-root {
    font-size: 1rem;
    margin-bottom: 8px;
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  .signInText {
    color: #065FD4;
    cursor: pointer;
  }
`;

class HeartFavoriteToggleBase extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXOpposersCountLocal: 0,
      campaignXSupportersCountLocal: 0,
      voterOpposesLocal: false,
      voterSupportsLocal: false,
      anchorEl: null, // Anchors to capture element for popover
      popoverText: '', // Text for the popover
    };
  }

  componentDidMount () {
    this.onPropsChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButton componentDidUpdate');
    const {
      campaignXSupportersCount: campaignXSupportersCountPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
      voterOpposes: voterOpposesPrevious,
      voterSupports: voterSupportsPrevious,
    } = prevProps;
    const {
      campaignXSupportersCount,
      campaignXWeVoteId,
      voterOpposes,
      voterSupports,
    } = this.props;
    // console.log('HeartFavoriteToggleBase componentDidUpdate voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    if (campaignXWeVoteId) {
      if ((campaignXWeVoteId !== campaignXWeVoteIdPrevious) ||
        (campaignXSupportersCount !== campaignXSupportersCountPrevious) ||
        (voterOpposes !== voterOpposesPrevious) ||
        (voterSupports !== voterSupportsPrevious)) {
        this.onPropsChange();
      }
    }
  }

  onPropsChange () {
    const { campaignXOpposersCount, campaignXSupportersCount, voterSupports, voterOpposes } = this.props;
    // console.log('HeartFavoriteToggleBase onPropsChange voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    this.setState({
      campaignXOpposersCountLocal: campaignXOpposersCount,
      campaignXSupportersCountLocal: campaignXSupportersCount,
      voterSupportsLocal: voterSupports,
      voterOpposesLocal: voterOpposes,
    });
  }

  handleSignInClick = () => {
    const { voterSignedInWithEmail } = this.props;
    if (!voterSignedInWithEmail) {
      if (this.props.submitSupport) {
        this.props.submitSupport();
      }
    }
  };

  handleOpposeClick = (event) => {
    const oppose = true;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Don’t like this politician?');
  }

  handleStopOpposingClick = (event) => {
    const oppose = false;
    const support = false;
    const stopOpposing = true;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Don’t like this politician?');
  }

  handleStopSupportingClick = (event) => {
    const oppose = false;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = true;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Like this politician?');
  }

  handleSupportClick = (event) => {
    const oppose = false;
    const support = true;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Like this politician?');
  }

  handleActionClick = (event, support = true, oppose = false, stopSupporting = false, stopOpposing = false, popoverText = '') => {
    const { campaignXWeVoteId, voterSignedInWithEmail } = this.props;
    const {
      campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious,
      campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious,
      showSignInPromptSupports: showSignInPromptSupportsPrevious,
      showSignInPromptOpposes: showSignInPromptOpposesPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    if (!voterSignedInWithEmail) {
      // Toggle sign in prompt
      this.setState({
        showSignInPromptSupports: support ? !showSignInPromptSupportsPrevious : false,
        showSignInPromptOpposes: oppose ? !showSignInPromptOpposesPrevious : false,
        anchorEl: event.currentTarget,
        popoverText,
      });
    } else {
      this.setState({
        voterSupportsLocal: support,
        voterOpposesLocal: oppose,
      }, () => {
        if (support) {
          if (!voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious + 1,
            }, () => {
              if (this.props.submitSupport) {
                this.props.submitSupport();
              }
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
          if (voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: Math.max(0, campaignXOpposersCountLocalPrevious - 1),
            }, () => {
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
        } else if (stopSupporting) {
          if (voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: Math.max(0, campaignXSupportersCountLocalPrevious - 1),
            }, () => {
              if (this.props.submitStopSupporting) {
                this.props.submitStopSupporting();
              }
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
        } else if (oppose) {
          if (!voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious + 1,
            }, () => {
              if (this.props.submitOppose) {
                this.props.submitOppose();
              }
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
          if (voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: Math.max(0, campaignXSupportersCountLocalPrevious - 1),
            }, () => {
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
        } else if (stopOpposing) {
          if (voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: Math.max(0, campaignXOpposersCountLocalPrevious - 1),
            }, () => {
              if (this.props.submitStopOpposing) {
                this.props.submitStopOpposing();
              }
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
        }
      });
    }
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
      popoverText: '',
    });
  }

  render () {
    const {
      voterSignedInWithEmail,
    } = this.props;
    const {
      campaignXSupportersCountLocal,
      campaignXOpposersCountLocal,
      showSignInPromptOpposes,
      showSignInPromptSupports,
      voterOpposesLocal,
      voterSupportsLocal,
      anchorEl,
      popoverText,
    } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // console.log('campaignXSupportersCountLocal', campaignXSupportersCountLocal, 'campaignXOpposersCountLocal', campaignXOpposersCountLocal);
    // console.log('HeartFavoriteToggleBase voterSupportsLocal', voterSupportsLocal, 'voterOpposesLocal', voterOpposesLocal);
    return (
      <HeartFavoriteToggleContainer>
        <LikeContainer onClick={(event) => {
          if (voterSupportsLocal) {
            return this.handleStopSupportingClick(event);
          } else {
            return this.handleSupportClick(event);
          }
        }}
        >
          <HeartFavoriteToggleIcon
            isFavorite
            voterSupports={voterSupportsLocal}
          />
          {!voterOpposesLocal && (
            <span>
              {numberWithCommas(campaignXSupportersCountLocal)}
            </span>
          )}
        </LikeContainer>
        <DislikeContainer onClick={(event) => {
          if (voterOpposesLocal) {
            return this.handleStopOpposingClick(event);
          } else {
            return this.handleOpposeClick(event);
          }
        }}
        >
          <HeartFavoriteToggleIcon
            isDislike
            voterOpposes={voterOpposesLocal}
          />
          {voterOpposesLocal && (
            <span>
              {numberWithCommas(campaignXOpposersCountLocal)}
            </span>
          )}
        </DislikeContainer>
        {(!voterSignedInWithEmail && (showSignInPromptOpposes || showSignInPromptSupports)) && (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => this.handlePopoverClose()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                component: CustomPopoverPaper,
              },
            }}
          >
            <h2 className="MuiTypography-root">{popoverText}</h2>
            <Typography variant="body1">Sign in to make your opinion count.</Typography>
            <Typography>
              <Button className="signInText" onClick={this.handleSignInClick}>Sign In</Button>
            </Typography>
          </Popover>
        )}
      </HeartFavoriteToggleContainer>
    );
  }
}

HeartFavoriteToggleBase.propTypes = {
  campaignXOpposersCount: PropTypes.number,
  campaignXSupportersCount: PropTypes.number,
  campaignXWeVoteId: PropTypes.string,
  submitOppose: PropTypes.func,
  submitStopOpposing: PropTypes.func,
  submitStopSupporting: PropTypes.func,
  submitSupport: PropTypes.func,
  voterSignedInWithEmail: PropTypes.bool,
  voterSupports: PropTypes.bool,
  voterOpposes: PropTypes.bool,
};


const HeartFavoriteToggleContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  background: ${DesignTokenColors.whiteUI};
`;

const LikeContainer = styled('div')`
  display: flex;
  padding-right: 8px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};
  cursor: pointer;
`;

const DislikeContainer = styled('div')`
  display: flex;
  padding-left: 8px;
  cursor: pointer;
`;

export default HeartFavoriteToggleBase;
