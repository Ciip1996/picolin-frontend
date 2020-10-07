// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/** Material Assets and Components */

/** Atoms, Components and Styles */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import CollapsiblePanel from 'UI/components/templates/CollapsiblePanel';
import MapBox from 'UI/components/templates/MapBox';
import MapSideMenu from 'UI/components/organisms/MapSideMenu';
import { toggleMenu } from 'actions/map';
import { PageTitles } from 'UI/constants/defaults';

type MapLayoutProps = {
  isSideMenuOpen: boolean,
  onMenuToggle: () => mixed
};

const MapLayout = (props: MapLayoutProps) => {
  const { isSideMenuOpen, onMenuToggle } = props;

  useEffect(() => {
    document.title = PageTitles.Map;
  }, []);

  return (
    <ContentPageLayout customStyle={{ display: 'block' }}>
      <CollapsiblePanel isSideMenuOpen={isSideMenuOpen} mode="inline" onToggle={onMenuToggle}>
        <MapSideMenu />
      </CollapsiblePanel>
      <MapBox />
    </ContentPageLayout>
  );
};

const mapStateToProps = ({ map }) => {
  return {
    isSideMenuOpen: map.ui.isSideMenuOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMenuToggle: () => dispatch(toggleMenu())
  };
};

const MapLayoutConnected = connect(mapStateToProps, mapDispatchToProps)(MapLayout);

const Map = () => {
  return <MapLayoutConnected />;
};

export default Map;
