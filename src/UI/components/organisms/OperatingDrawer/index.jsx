// @flow
import React, { useState } from 'react';

import TabsView from 'UI/components/templates/TabsView';
import { CandidatesIcon, JobOrdersIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import { EntityType } from 'UI/constants/entityTypes';
import OperatingSummary from '../OperatingSummary';

type OperatingDrawerProps = {
  onClose: () => void
};

const OperatingDrawer = (props: OperatingDrawerProps) => {
  const { onClose } = props;
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false,
    activeTab: 0
  });

  const handleItemClick = () => {
    onClose && onClose();
  };

  const tabsProp = [
    {
      label: 'Candidates',
      icon: <CandidatesIcon />,
      view: <OperatingSummary type={EntityType.Candidate} onProfileClick={handleItemClick} />
    },
    {
      label: 'Job Orders',
      icon: <JobOrdersIcon />,
      view: <OperatingSummary type={EntityType.Joborder} onProfileClick={handleItemClick} />
    }
  ];

  const handleTabChange = (event, newValue) => {
    setUiState(prevState => ({ ...prevState, activeTab: newValue }));
  };

  return (
    <DrawerFormLayout
      onSubmit={() => {}}
      title="Operating at 10"
      onClose={onClose}
      uiState={uiState}
      isBottomToolbarNeeded={false}
      variant="borderless"
      contentStyle={{ padding: 0 }}
    >
      <TabsView
        content="start"
        selectedTab={uiState.activeTab}
        onChangeTabIndex={handleTabChange}
        tabs={tabsProp}
      />
    </DrawerFormLayout>
  );
};

export default OperatingDrawer;
