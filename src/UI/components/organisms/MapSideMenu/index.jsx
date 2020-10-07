// @flow
import React from 'react';
import { connect } from 'react-redux';
/** Material Assets and Components */
import TabsView from 'UI/components/templates/TabsView';

/** Atoms, Components and Styles */
import MapDigTab from 'UI/components/organisms/MapDigTab';
import { DigIcon, InventoryIconMap } from 'UI/res';

import MapInventoryTab from 'UI/components/organisms/MapInventoryTab';
import { selectTab } from 'actions/map';
import { styles } from './styles';

type MapSideMenuProps = {
  activeTab?: number,
  onTabChange: (activeTab: number) => mixed
};

const MapSideMenu = (props: MapSideMenuProps) => {
  const { activeTab = 0, onTabChange } = props;

  const handleTabChange = (event, newValue = -1) => {
    onTabChange && onTabChange(newValue);
  };

  // TODO: check that this is no longer required
  // const handleIndexChange = index => {
  //   onTabChange && onTabChange(index);
  // };

  const tabsProp = [
    {
      label: 'DIG',
      icon: <DigIcon />,
      view: <MapDigTab />
    },
    {
      label: 'Inventory',
      icon: <InventoryIconMap />,
      view: <MapInventoryTab />
    }
  ];

  return (
    <div style={styles.container}>
      <TabsView
        content="start"
        selectedTab={activeTab}
        onChangeTabIndex={handleTabChange}
        tabs={tabsProp}
      />
    </div>
  );
};

MapSideMenu.defaultProps = {
  activeTab: 0
};

const mapStateToProps = ({ map }) => {
  return {
    activeTab: map.ui.activeTab
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTabChange: tab => dispatch(selectTab(tab))
  };
};

const MapSideMenuConnected = connect(mapStateToProps, mapDispatchToProps)(MapSideMenu);

export default MapSideMenuConnected;
