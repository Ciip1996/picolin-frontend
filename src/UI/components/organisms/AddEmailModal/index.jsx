// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Box from '@material-ui/core/Box';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ActionButton from 'UI/components/atoms/ActionButton';

import Grid from '@material-ui/core/Grid';
import { Endpoints } from 'UI/constants/endpoints';
import { CancelSaveButton } from 'UI/constants/dimensions';

import { colors } from 'UI/res';
import { useStyles } from 'UI/pages/Names/styles';
import { styles } from './style';

const AddEmailModal = () => {
  const history = useHistory();
  const classes = useStyles();

  const handleCancelClick = () => {
    history.goBack();
  };

  return (
    <div style={styles} className={classes.paper}>
      <Box display="flex" px={2} alignItems="center" height={72} bgcolor={colors.sideBar}>
        <TitleLabel fontSize={26} text="ADD EMAIL" />
      </Box>
      <Box px={4} style={styles.AutocompleteBox}>
        <AutocompleteSelect
          placeholder="Search by name or email *"
          url={Endpoints.Specialties}
          groupBy={option => option.industry_title}
        />
      </Box>
      <Grid container style={styles.gridWidth} spacing={3}>
        <Grid item sm={4}>
          <AutocompleteSelect
            placeholder="Full Name *"
            url={Endpoints.Specialties}
            groupBy={option => option.industry_title}
          />
        </Grid>
        <Grid item sm={4}>
          <AutocompleteSelect
            placeholder="Email *"
            url={Endpoints.Specialties}
            groupBy={option => option.industry_title}
          />
        </Grid>
        <Grid item sm={4}>
          <AutocompleteSelect
            placeholder="Status *"
            url={Endpoints.Specialties}
            groupBy={option => option.industry_title}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        px={2}
        alignItems="center"
        justifyContent="flex-end"
        height={72}
        bgcolor={colors.sideBar}
      >
        <Box mr={3}>
          <ActionButton
            variant="outlined"
            width={CancelSaveButton}
            text="Close"
            onClick={handleCancelClick}
          />
        </Box>
        <ActionButton text="Save" type="submit" width={CancelSaveButton} />
      </Box>
    </div>
  );
};

export default AddEmailModal;
