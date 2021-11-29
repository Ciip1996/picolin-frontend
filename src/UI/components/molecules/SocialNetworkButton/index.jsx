// @flow
import React from 'react';
import { Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  LinkedinIcon,
  GlassdoorIcon,
  IndeedIcon,
  CareerbuilderIcon,
  CopyIcon,
  colors
} from 'UI/res';
import { normalizeUrl } from 'UI/utils';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import Text from 'UI/components/atoms/Text';
import { styles } from './styles';

type SocialNetworkButtonProps = {
  url: string,
  type: 'linkedin' | 'glassdoor' | 'indeed' | 'careerbuilder',
  width?: string
};

const icons = {
  linkedin: <LinkedinIcon fill={colors.black} />,
  glassdoor: <GlassdoorIcon fill={colors.black} />,
  indeed: <IndeedIcon fill={colors.black} />,
  careerbuilder: <CareerbuilderIcon fill={colors.black} />
};

const SocialNetworkButton = (props: SocialNetworkButtonProps) => {
  const { url, width, type } = props;
  const link = normalizeUrl(url);
  return (
    <Box
      display="flex"
      width={width}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link
        component="a"
        style={styles.Link}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Box display="flex" alignItems="center">
          <Box mr={1}>{icons[type]}</Box>
          <Text variant="body1" cropped text={link} />
        </Box>
      </Link>

      <CopyToClipboard onCopy={() => ({ copied: true })} text={link}>
        <CustomIconButton
          tooltipPosition="bottom"
          style={styles}
          tooltipText="Copy link"
        >
          <CopyIcon fill={colors.black} />
        </CustomIconButton>
      </CopyToClipboard>
    </Box>
  );
};

SocialNetworkButton.defaultProps = {
  width: '100%',
  type: 'linkedin'
};

export default SocialNetworkButton;
