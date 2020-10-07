// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { colors } from 'UI/res';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { style } from './styles';

type NewItemsSubtitlesProps = {
  subTitle: string,
  description: string
};

const NewItemsSubtitles = (props: NewItemsSubtitlesProps) => {
  const { subTitle, description } = props;
  return (
    <Box
      width="100%"
      minHeight={67}
      bgcolor={colors.sideBar}
      display="flex"
      alignItems="center"
      px={4}
      flexWrap="wrap"
      style={style}
    >
      <Box pr={4}>
        <TitleLabel textTransform="uppercase" fontSize={26} fontWeight={700} text={subTitle} />
      </Box>
      <Box>{description}</Box>
    </Box>
  );
};

export default NewItemsSubtitles;
