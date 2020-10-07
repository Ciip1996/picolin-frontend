// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-map-gl';

import MapMarker from 'UI/components/atoms/MapMarker';

type MapMarkersProps = {
  markers: Array<any>,
  isDigActive: boolean,
  entityType?: string,
  onMarkerEnter: (info: any) => void
};

const MapMarkers = (props: MapMarkersProps) => {
  const { markers, entityType, isDigActive, onMarkerEnter } = props;

  const onClick = marker => {
    onMarkerEnter && onMarkerEnter(marker);
  };

  return (
    <>
      {markers.map(marker => {
        return (
          marker.longitude &&
          marker.latitude && (
            <div key={`marker-${isDigActive ? marker.state : marker.id}`}>
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                offsetLeft={-20}
                offsetTop={-20}
              >
                <MapMarker
                  info={marker}
                  isDigActive={isDigActive}
                  entityType={entityType}
                  onMouseEnter={onClick}
                />
              </Marker>
            </div>
          )
        );
      })}
    </>
  );
};

MapMarkers.defaultProps = {
  entityType: undefined
};

const mapStateToProps = ({ map }) => {
  return {
    markers: map.domain.markers,
    entityType: map.domain.filters.entityType?.value?.id,
    isDigActive: map.ui.activeTab === 0
  };
};

const MapMarkersConnected = connect(mapStateToProps)(React.memo(MapMarkers));

export default MapMarkersConnected;
