// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Box from '@material-ui/core/Box';
import ActionButton from 'UI/components/atoms/ActionButton';
import { CancelSaveButton } from 'UI/constants/dimensions';

import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { useStyles } from 'UI/pages/Names/styles';
import ProjectList from '../ProjectList';
import { styles } from './styles';

const AddToProjectModal = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleCancelClick = () => {
    history.goBack();
  };

  return (
    <div className={classes.paper} style={styles.modal}>
      <Box display="flex" px={2} alignItems="center" height={72} bgcolor={colors.sideBar}>
        <TitleLabel fontSize={26} text="ADD TO A SEARCH PROJECT LIST" />
      </Box>
      <ProjectList />
      <Box px={2} bgcolor={colors.sideBar} style={styles}>
        <Box mr={3}>
          <ActionButton
            variant="outlined"
            width={CancelSaveButton}
            text="Cancel"
            onClick={handleCancelClick}
          />
        </Box>
        <ActionButton text="Add" type="submit" width={CancelSaveButton} />
      </Box>
    </div>
  );
};

export default AddToProjectModal;
