// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ActionButton from 'UI/components/atoms/ActionButton';

import Grid from '@material-ui/core/Grid';
import { Endpoints } from 'UI/constants/endpoints';
import { CancelSaveButton } from 'UI/constants/dimensions';

import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { useStyles } from 'UI/pages/Names/styles';
import { styles } from './styles';

const CreateProjectModal = () => {
  const [value, setValue] = React.useState('yes');
  const history = useHistory();
  const classes = useStyles();

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleCancelClick = () => {
    history.goBack();
  };

  return (
    <div style={styles} className={classes.paper}>
      <Box display="flex" px={2} alignItems="center" height={72} bgcolor={colors.sideBar}>
        <TitleLabel fontSize={26} text="CREATE A NEW SEARCH PROJECT" />
      </Box>
      <Box px={4}>
        <FormControl component="fieldset">
          <Text variant="body1" fontWeight={700} text="Share with all Users" />
          <RadioGroup aria-label="share" name="share1" value={value} onChange={handleChange}>
            <Box display="flex">
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
            </Box>
          </RadioGroup>
        </FormControl>
        <Grid container spacing={3}>
          <Grid item style={styles.Grid}>
            <TextBox name="project_name" label="Search Project Name *" />
          </Grid>
          <Grid item style={styles.Grid}>
            <AutocompleteSelect
              placeholder="Industry: Specialty *"
              url={Endpoints.Specialties}
              groupBy={option => option.industry_title}
            />
          </Grid>
          <Grid item style={styles.Grid}>
            <AutocompleteSelect
              placeholder="Subspecialty *"
              url={Endpoints.Specialties}
              groupBy={option => option.industry_title}
            />
          </Grid>
          <Grid item style={styles.Grid}>
            <AutocompleteSelect
              placeholder="Location *"
              url={Endpoints.Specialties}
              groupBy={option => option.industry_title}
            />
          </Grid>
          <Grid item style={styles.Grid}>
            <AutocompleteSelect
              placeholder="Type *"
              url={Endpoints.SourceTypes}
              groupBy={option => option.industry_title}
            />
          </Grid>
        </Grid>
      </Box>
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
            text="Cancel"
            onClick={handleCancelClick}
          />
        </Box>
        <ActionButton text="Save" type="submit" width={CancelSaveButton} />
      </Box>
    </div>
  );
};

export default CreateProjectModal;
