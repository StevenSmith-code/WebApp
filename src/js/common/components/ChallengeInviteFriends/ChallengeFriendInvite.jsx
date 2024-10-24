import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { RemoveRedEye, CheckCircle, Check, MoreHoriz } from '@mui/icons-material';
import DesignTokenColors from '../Style/DesignTokenColors';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';

const InvitedFriendDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FriendName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin-left: 10px;
  span {
    font-weight: bold;
    color: ${DesignTokenColors.neutral900};
  }
`;

const MessageStatus = styled.div`
  width: 200px;
  text-align: center;
  font-size: 14px;  
  color: ${DesignTokenColors.greenUI500};
`;

const VerticalLine = styled.div` 
  border-left: 1px solid black; 
  height: 30px; 
  margin: 0 10px; 
`;

const ActivityCommentEditWrapper = styled('div')`
  margin-left: 10px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  color: #4371cc;
`;

const InformationtoWevote = styled.div`
  border: 2px solid #4371cc;
  border-radius: 15px;
  padding:5px;
  font-size: 15px;;
`;

const ChallengeFriendInvite = ({ friendDetails }) => {

    const { sx, children } = speakerDisplayNameToInitials(friendDetails.name);
    return(
        <InvitedFriendDetails>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FriendName>
                    <Avatar sx={{ ...sx, width: 35, height: 35, fontSize: '1rem' }}>{children}</Avatar>
                    {' '}
                    <span>{friendDetails.name}</span>
                </FriendName>
                <MessageStatus>
                    {friendDetails.messageStatus === 'Message Viewed' && <RemoveRedEye style={{ color: '#008000' }} />}
                    {friendDetails.messageStatus === 'Message Sent' && <Check />}   
                    {friendDetails.messageStatus === 'Challenge Joined' && <CheckCircle style={{ color: '#008000' }} />} 
                    {'  '}
                    {friendDetails.messageStatus}
                </MessageStatus>  
                <VerticalLine />
                <ActivityCommentEditWrapper>   
                    <MoreHoriz />
                </ActivityCommentEditWrapper>
            </div>
            <Options>
                <div>
                    {friendDetails.messageStatus === '' && (
                        <InformationtoWevote>{`Let us know you sent the message`}</InformationtoWevote>
                    )}
                </div>
                {friendDetails.messageStatus !== 'Challenge Joined' && (<div style={{padding:'5px'}}>{`Invite Again`}</div>)}
            </Options>
        </InvitedFriendDetails>
    )
};

export default ChallengeFriendInvite;