// @flow
import React from 'react';

/** Assets */
import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import MapGroupedMarker from 'UI/components/atoms/MapGroupedMarker';
import { EntityType } from 'UI/constants/entityTypes';
import { colors } from 'UI/res';

type MapMarkerProps = {
  isDigActive?: boolean,
  onClick?: (info: any) => void,
  onMouseEnter?: (info: any) => void,
  entityType?: string,
  info: any
};

const MapMarker = (props: MapMarkerProps) => {
  const { isDigActive, onClick, onMouseEnter, info, entityType } = props;

  const renderMarker = () => {
    if (isDigActive) {
      if (info.values && info.values.length > 1) {
        return (
          <MapGroupedMarker
            groupedData={info.values}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            titleField="full_name"
          />
        );
      }
      if (info.values && info.values.length === 1) {
        return (
          <ColorIndicator
            color={info.values[0].color}
            width={42}
            height={42}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            info={info.values[0]}
          />
        );
      }
      return null;
    }

    return (
      <ColorIndicator
        color={entityType !== EntityType.Company ? info.type_class : colors.active}
        width={18}
        height={18}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        info={info}
      />
    );
  };

  return renderMarker();
};

MapMarker.defaultProps = {
  isDigActive: true,
  onClick: undefined,
  entityType: undefined
};

export default MapMarker;
