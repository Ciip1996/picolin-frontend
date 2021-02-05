// @flow
import React from 'react';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';
import { colors, CalendarIcon } from 'UI/res';
import { DateFormats } from 'UI/constants/defaults';
import { AdditionalRecruiterType } from 'UI/constants/status';
import { nestTernary } from 'UI/utils';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import { styles } from './styles';

type ProductCardProps = {
  date: string,
  creator: string,
  recruiter: string | null,
  otherRecruiter: string | null,
  isLoading: boolean,
  action: string,
  type: string
};

const ProductCard = (props: ProductCardProps) => {
  const { date, creator, recruiter, otherRecruiter, isLoading, action, type } = props;

  const formattedDate = moment(date).format(DateFormats.International.SimpleDateTime);

  return (
    <Box my={2}>
      {isLoading ? (
        <>
          <Box my={1} flexDirection="row" display="flex">
            <CustomSkeleton radius={15} width={30} height={30} />
            <Box ml={1} flex={1}>
              <CustomSkeleton height={20} />
            </Box>
          </Box>
          <Box mt={1}>
            <CustomSkeleton height={20} />
          </Box>
        </>
      ) : (
        <>
          <p style={styles.dateContainer}>
            <CalendarIcon size={16} fill={colors.completeBlack} />
            <Text
              variant="body1"
              text={formattedDate || ''}
              customStyle={styles.dateLabel}
              component="span"
            />
          </p>
          <p style={styles.itemContent}>
            {getHistoryDescription(type, action, creator, recruiter, otherRecruiter)}
          </p>
        </>
      )}
    </Box>
  );
};

const getHistoryDescription = (type, action, creator, recruiter, otherRecruiter) => {
  return type === AdditionalRecruiterType.Main ||
    (type === AdditionalRecruiterType.Accountable && action === 'assign' && creator !== recruiter)
    ? getDescriptionForAssignment(creator, recruiter)
    : nestTernary(
        type === AdditionalRecruiterType.Accountable,
        getDescriptionForAccountable(action, creator, recruiter),
        nestTernary(
          type === AdditionalRecruiterType.Collaborator,
          getDescriptionForCollaborator(action, creator, recruiter, otherRecruiter),
          <>
            <b>{creator}</b> created this item
          </>
        )
      );
};

const getDescriptionForAssignment = (creator, recruiter) => {
  return (
    <>
      <b>{creator}</b> assigned this item to <b>{recruiter}</b>
    </>
  );
};

const getDescriptionForAccountable = (action, creator, recruiter) => {
  return action === 'assign' ? (
    <>
      <b>{recruiter}</b> is now working this item
    </>
  ) : (
    <>
      <b>{creator}</b> removed assignment to <b>{recruiter}</b>
    </>
  );
};

const getDescriptionForCollaborator = (action, creator, recruiter, otherRecruiter) => {
  if (creator !== otherRecruiter) {
    return action === 'assign' ? (
      <>
        <b>{creator}</b> assigned <b>{recruiter}</b> to collaborate with <b>{otherRecruiter}</b>
      </>
    ) : (
      <>
        <b>{creator}</b> removed <b>{recruiter}</b> from collaborating with <b>{otherRecruiter}</b>
      </>
    );
  }
  return action === 'assign' ? (
    <>
      <b>{creator}</b> is now collaborating with <b>{recruiter}</b>
    </>
  ) : (
    <>
      <b>{creator}</b> is no longer collaborating with <b>{recruiter}</b>
    </>
  );
};

ProductCard.defaultProps = {
  date: '',
  action: 'assign',
  type: 'main',
  creator: '',
  recruiter: '',
  otherRecruiter: '',
  isLoading: false
};

export default ProductCard;
