// @flow
import React from 'react';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import CustomSkeleton from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/CustomSkeleton';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import { styles } from './styles';

type InfoLabelProps = {
  title: string,
  fontSizeTitle?: number,
  fontWeightTitle?: number,
  description: string,
  fontSizeDescription?: number,
  fontWeightDescription?: number,
  cropped?: boolean,
  colorIndicator: any,
  isLoading: boolean | null
};

const InfoLabel = (props: InfoLabelProps) => {
  const {
    title,
    fontSizeTitle,
    fontWeightTitle,
    description = '---',
    fontSizeDescription,
    fontWeightDescription,
    cropped,
    colorIndicator,
    isLoading
  } = props;

  /* IMPORTANT: this atom is being rendering excecively into the DOM (specially in the tabs page)
     Use the least amount possible of components/tags in order to prevent slow deficient rendering. */
  return (
    <>
      {isLoading ? (
        <CustomSkeleton onContainer style={styles.skeleton} />
      ) : (
        <Text variant="body2" fontWeight={fontWeightTitle} fontSize={fontSizeTitle} text={title} />
      )}
      {colorIndicator && <ColorIndicator height={15} width={15} color={colorIndicator} />}
      {isLoading ? (
        <CustomSkeleton onContainer style={{ ...styles.skeleton, width: '90%', marginTop: 8 }} />
      ) : (
        <Text
          customStyle={colorIndicator && { display: 'inline-block', marginLeft: 10 }}
          variant="subtitle1"
          fontWeight={fontWeightDescription}
          fontSize={fontSizeDescription}
          text={description}
          title={description}
          cropped={cropped}
        />
      )}
    </>
  );
};

InfoLabel.defaultProps = {
  fontSizeTitle: undefined,
  fontWeightTitle: undefined,
  fontSizeDescription: undefined,
  fontWeightDescription: undefined,
  cropped: true,
  colorIndicator: undefined,
  isLoading: false
};

export default InfoLabel;
