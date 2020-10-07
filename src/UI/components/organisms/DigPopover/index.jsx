// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// import ActionButton from 'ActionButton';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
// import { styles } from './styles';

type DigPopoverProps = {
  titleName?: string,
  acron?: string,
  coach?: string,
  backgroundColor?: string,
  recruiterExtension?: string,
  recruiterEmail?: string
  // lastSendout?: string,
  // production?: string,
  // numberActiveSendouts: number,
  // datelastPlacements: string
};

const DigPopover = (props: DigPopoverProps) => {
  const {
    titleName,
    acron,
    // lastSendout,
    // production,
    // numberActiveSendouts,
    // datelastPlacements,
    coach,
    recruiterExtension,
    recruiterEmail,
    backgroundColor
  } = props;
  return (
    <Box>
      {/* 
      
      New Design markup
      <Typography component="div">
        <Box>
          <Box display="flex" alignItems="center">
            <CustomAvatar acron={acron} backgroundColor={backgroundColor} />
            <Box ml={2}>
              <Box textAlign="left" m={0} fontSize={18} fontWeight={700}>
                {titleName}
              </Box>
              <Box my={0} fontSize={14} fontWeight={400}>
                Coach: {coach}
              </Box>
            </Box>
          </Box>
             NOTE: Commented out since it's not going to be used in the first release 
          <Box fontSize={14} mt={1.5} display="none" flexDirection="column">
            <Box>Last Sendout: {lastSendout}</Box>
            <Box>Production: {production}</Box>
            <Box>Active Sendouts: {numberActiveSendouts}</Box>
            <Box>Last Placements: {datelastPlacements}</Box>
          </Box>
        </Box>
      </Typography> */}

      {/* Set temp markup until implentation of new markup design */}
      <Typography component="div">
        <Box>
          <Box display="flex" alignItems="center">
            <CustomAvatar acron={acron} backgroundColor={backgroundColor} />
            <Box ml={2}>
              <Box textAlign="left" m={0} fontSize={18} fontWeight={700}>
                {titleName}
              </Box>
              <Box my={0} fontSize={14} fontWeight={400}>
                Coach: {coach}
              </Box>
            </Box>
          </Box>
          <Box textAlign="center" fontSize={16} width={40} fontWeight={500}>
            {acron}
          </Box>
          <Box fontSize={14} mt={1.5} display="flex" flexDirection="column">
            <span>Ext. {recruiterExtension} </span>
            {recruiterEmail}
          </Box>
        </Box>
      </Typography>
    </Box>
  );
};

// NOTE: default props set for display the design please replace with according data

DigPopover.defaultProps = {
  titleName: 'titleName',
  acron: 'acron',
  coach: 'coach',
  backgroundColor: '',
  recruiterExtension: '',
  recruiterEmail: ''
  // lastSendout: '15/01/20',
  // production: '$11,000 Per Month',
  // numberActiveSendouts: 5,
  // datelastPlacements: '15/02/20'
};

export default DigPopover;
