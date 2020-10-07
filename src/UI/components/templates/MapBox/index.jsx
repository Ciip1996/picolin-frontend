// @flow
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import MapGL, {
  NavigationControl,
  Popup,
  FlyToInterpolator,
  WebMercatorViewport
} from 'react-map-gl';
import bbox from '@turf/bbox';
import multiPoint from 'turf-multipoint';

import PopUpContent from 'UI/components/organisms/PopUpContent';
import MapMarkers from 'UI/components/organisms/MapMarkers';
import { relDiff, roundDecimals } from 'UI/utils';
import { usCenterCoordinates } from 'UI/constants/defaults';
import { styles } from './styles';

type MapBoxProps = {
  markers: Array<any>,
  isDigActive: boolean,
  entityType?: string,
  selectedRecruiter?: any,
  isSideMenuOpen: boolean
};

type MercatorViewport = {
  width?: number,
  height?: number,
  longitude: number,
  latitude: number,
  zoom?: number,
  pitch?: number,
  bearing?: number,
  altitude?: number,
  nearZMultiplier?: number,
  farZMultiplier?: number
};

/* MapboxGL crashes if we try to move the viewport to the same coordinates. This function is intended to avoid this behaviour.
 * Also it's necessary to ask for a relative difference because sometimes because of floating point operations the viewport comparisons
 * don't work with strict equality
 */
const isSameViewport = (viewportLat, viewportLong, lat, long) => {
  const numberOfDecimals = 7;

  return (
    relDiff(roundDecimals(lat, numberOfDecimals), roundDecimals(viewportLat, numberOfDecimals)) <
      0.01 &&
    relDiff(roundDecimals(long, numberOfDecimals), roundDecimals(viewportLong, numberOfDecimals)) <
      0.01
  );
};

const MapBox = (props: MapBoxProps) => {
  const { entityType, isDigActive, markers, selectedRecruiter, isSideMenuOpen } = props;

  const [viewport, setViewport] = useState({
    latitude: usCenterCoordinates.latitude,
    longitude: usCenterCoordinates.longitude,
    zoom: 4,
    width: '100%',
    height: '100vh'
  });
  const [popupInfo, setPopupInfo] = useState();
  const latestViewport = useRef<MercatorViewport>(usCenterCoordinates);
  const [visiblePoints, setVisiblePoints] = useState();

  const fitToCoordinates = useCallback(() => {
    if (!visiblePoints || !visiblePoints.length) {
      return;
    }

    const newViewport = new WebMercatorViewport(latestViewport.current);
    const pointsFeature = multiPoint(visiblePoints);
    const [minLng, minLat, maxLng, maxLat] = bbox(pointsFeature);

    const { longitude: newLong, latitude: newLat, zoom: newZoom } = newViewport.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      {
        padding: 100
      }
    );

    if (
      !isSameViewport(
        latestViewport.current.latitude,
        latestViewport.current.longitude,
        newLat,
        newLong
      )
    ) {
      // the map crashes if move to same viewport
      onViewportChange({
        longitude: newLong,
        latitude: newLat,
        zoom: newZoom > 19 ? 10 : newZoom,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: 'auto'
      });
    }
  }, [visiblePoints]);

  useEffect(() => {
    setPopupInfo(null);

    if (!markers || !markers.length) {
      return;
    }

    const points = markers.map(mkr => (mkr.longitude ? [mkr.longitude, mkr.latitude] : []));
    setVisiblePoints(points);
  }, [markers]);

  useEffect(() => {
    fitToCoordinates();
  }, [visiblePoints, fitToCoordinates]);

  useEffect(() => {
    if (!selectedRecruiter) {
      return;
    }

    const recruiterStates = selectedRecruiter.states;

    if (recruiterStates && recruiterStates.length === 1) {
      if (
        !isSameViewport(
          latestViewport.current.latitude,
          latestViewport.current.longitude,
          selectedRecruiter.latitude,
          selectedRecruiter.longitude
        )
      ) {
        onViewportChange({
          longitude: selectedRecruiter.longitude,
          latitude: selectedRecruiter.latitude,
          zoom: 5,
          transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
          transitionDuration: 'auto'
        });
      }
    } else {
      const points = recruiterStates.map(state => [state.longitude, state.latitude]);
      setVisiblePoints(points);
    }

    setPopupInfo(selectedRecruiter);
  }, [selectedRecruiter]);

  const onMarkerEnter = info => {
    setPopupInfo(info);
  };

  const onViewportChange = vp => {
    latestViewport.current = vp;
    setViewport(vp);
  };

  const onMapClick = () => {
    setPopupInfo(null);
  };

  function renderPopUp() {
    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="bottom"
          offsetLeft={0}
          offsetTop={-10}
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
        >
          <PopUpContent info={popupInfo} isDigActive={isDigActive} entityType={entityType} />
        </Popup>
      )
    );
  }

  const mapStyles = {
    ...styles.mapContainer,
    ...(isSideMenuOpen ? styles.filtersOpen : styles.filtersClosed)
  };

  return (
    <div style={mapStyles}>
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/gpac-dev-team/ck7m2ta7b0d5l1ipgi5uz3lbm"
        width="100%"
        height="100%"
        onViewportChange={onViewportChange}
        onClick={onMapClick}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <div className="nav" style={styles.navigationControl}>
          <NavigationControl onViewportChange={onViewportChange} />
        </div>
        <MapMarkers onMarkerEnter={onMarkerEnter} />
        {renderPopUp()}
      </MapGL>
    </div>
  );
};

MapBox.defaultProps = {
  entityType: '',
  selectedRecruiter: undefined
};

const mapStateToProps = ({ map }) => {
  return {
    markers: map.domain.markers,
    entityType: map.domain.filters.entityType?.value?.id,
    selectedRecruiter: map.ui.selectedRecruiter,
    isDigActive: map.ui.activeTab === 0,
    isSideMenuOpen: map.ui.isSideMenuOpen
  };
};

const MapBoxConnected = connect(mapStateToProps)(MapBox);

export default MapBoxConnected;
