// @flow
import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

type OperatingSkeletonProps = {
  numberOfItems: number,
  variant: 'card' | 'list'
};

const OperatingSkeleton = (props: OperatingSkeletonProps) => {
  const { numberOfItems, variant } = props;

  const buildCardItem = (i: number) => {
    return (
      <Card key={i} elevation={0} variant="outlined" mb={1} style={{ marginBottom: 16 }}>
        <CardContent>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <CustomSkeleton variant="circle" width={32} height={32} style={{ marginRight: 20 }} />
            <CustomSkeleton width={200} height={20} />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <CustomSkeleton
              variant="circle"
              width={28}
              height={28}
              style={{ marginLeft: 2, marginRight: 22 }}
            />
            <CustomSkeleton width="85%" height={18} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const buildListItem = (i: number) => {
    return (
      <ListItem key={i} divider disableGutters style={{ padding: 16 }}>
        <Box display="flex" flexDirection="column" alignItems="center" style={{ marginRight: 10 }}>
          <CustomSkeleton variant="circle" width={24} height={24} style={{ marginBottom: 8 }} />
          <CustomSkeleton variant="circle" width={32} height={32} />
        </Box>
        <ListItemText
          primary={<CustomSkeleton width="100%" height={18} style={{ marginBottom: 20 }} />}
          secondary={<CustomSkeleton width="100%" height={18} />}
        />
      </ListItem>
    );
  };

  const buildItems = () => {
    return Array.from({ length: numberOfItems }).map((_, i) =>
      variant === 'card' ? buildCardItem(i) : buildListItem(i)
    );
  };

  return variant === 'card' ? <Box> {buildItems()} </Box> : <List>{buildItems()}</List>;
};

OperatingSkeleton.defaultProps = {
  numberOfItems: 3,
  variant: 'card'
};

export default OperatingSkeleton;
