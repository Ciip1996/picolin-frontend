// @flow
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';
import { numberFormatter } from 'UI/utils';

import { CandidatesIcon, CompaniesIcon, JobOrdersIcon, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { useStyles } from './styles';

type SummaryTotalProps = {
  url: string
};

const IconsMap = {
  candidate: CandidatesIcon,
  jobOrder: JobOrdersIcon,
  company: CompaniesIcon
};

const renderIcon = (iconKey: string, size: number) => {
  if (!iconKey || !IconsMap[iconKey]) return null;
  const Icon = IconsMap[iconKey];
  return <Icon size={size} />;
};

const SummaryItem = withStyles({
  root: {
    '&:not(:last-child) > *': {
      borderRight: `1px solid ${colors.lightgrey}`
    }
  }
})(Grid);

const SummaryTotals = (props: SummaryTotalProps) => {
  const { url } = props;
  const minHeight = 60;
  const [isLoading, setIsLoading] = useState(true);
  const [summaryItems, setSummaryItems] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(url);
        if (response.data && response.status === 200) {
          setSummaryItems(response.data);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setIsLoading(false);
    };
    loadData();
  }, [url]);

  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" style={{ minHeight }}>
      <CircularProgress />
    </Box>
  ) : (
    <Grid container spacing={3}>
      {summaryItems.map(item => (
        <SummaryItem key={`stic-${item.icon}`} item xs={4}>
          <Box className={classes.summaryItem}>
            {item.icon && renderIcon(item.icon, 50)}
            <Box>
              <Typography variant="body1">{item.title}</Typography>
              <Typography variant="h1">{numberFormatter(item.total)}</Typography>
            </Box>
          </Box>
        </SummaryItem>
      ))}
    </Grid>
  );
};

export default SummaryTotals;
