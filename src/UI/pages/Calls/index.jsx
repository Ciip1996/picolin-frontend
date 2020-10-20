// @flow
import React from 'react';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { globalStyles } from 'GlobalStyles';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { DialPad } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import DateDivider from 'UI/components/atoms/DateDivider';
import { callsLabels } from 'UI/constants/mockData';
import CallRow from 'UI/components/organisms/CallRow';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { useStyles } from './style';

const Calls = () => {
  const classes = useStyles();

  return (
    <ContentPageLayout>
      <div style={globalStyles.contentLayout}>
        <TitleLabel backNavigation text="Calls" />

        <div className={classes.mainContainer}>
          <div className={classes.topBar}>
            <div className={classes.autoComplete}>
              <AutocompleteSelect placeholder="Search by name, phone number etc…" />
            </div>
            <CustomIconButton tooltipText="Dial">
              <DialPad />
            </CustomIconButton>
          </div>
          <div className={classes.callsContent}>
            <DateDivider date="15 Jun" />
            <CallRow callsLabels={callsLabels} />
          </div>
        </div>
      </div>
    </ContentPageLayout>
  );
};

export default Calls;
