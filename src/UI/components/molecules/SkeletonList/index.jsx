// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import CustomSkeleton from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/CustomSkeleton';
import { globalStyles } from 'GlobalStyles';
import { styles } from './styles';

type SkeletonItemProps = {
  rows: number
};

const SkeletonList = (props: SkeletonItemProps) => {
  const { rows } = props;

  return (
    <Box>
      <Box mb={2}>
        <Box style={styles.skeletonBar}>
          <Box display="flex" justifyContent="flex-end" width="95%" margin="0 auto">
            <CustomSkeleton onContainer variant="circle" width={24} height={24} />
            <Box mx={2}>
              <CustomSkeleton onContainer variant="circle" width={24} height={24} />
            </Box>
            <CustomSkeleton onContainer variant="circle" width={24} height={24} />
          </Box>
          <Box padding="10px 20px" style={globalStyles.skeletonContainer}>
            {Array.from(Array(5)).map((each, i) => (
              <div key={i.toString()} style={{ width: '100%' }}>
                <CustomSkeleton onContainer style={globalStyles.profileSkeletonItem} />
              </div>
            ))}
          </Box>
        </Box>
      </Box>
      <Box />
      <Box
        display="flex"
        flexDirection="column"
        bgcolor={colors.appBackgroundContrast}
        padding="10px 20px"
      >
        {Array.from(Array(rows)).map((each, i) => (
          <Box key={i.toString()} style={globalStyles.skeletonContainer}>
            {Array.from(Array(5)).map((e, j) => (
              <div key={j.toString()} style={{ width: '100%' }}>
                <CustomSkeleton style={globalStyles.profileSkeletonItem} />
              </div>
            ))}
          </Box>
        ))}
      </Box>
      <Box mt={2}>
        <CustomSkeleton width="100%" height={56} />
      </Box>
    </Box>
  );
};

SkeletonList.defaultProps = {
  rows: 6
};

export default SkeletonList;
