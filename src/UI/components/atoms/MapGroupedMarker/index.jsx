// @flow
import React, { useState } from 'react';
import PieChart from 'react-minimal-pie-chart';

type MapGroupedMarkerProps = {
  onClick?: (info: any) => void,
  onMouseEnter?: (info: any) => void,
  titleField: string,
  groupedData: Array<any>
};

const MapGroupedMarker = (props: MapGroupedMarkerProps) => {
  const size = 40;
  const { onClick, onMouseEnter, titleField = 'full_name', groupedData } = props;
  const [hovered, setHovered] = useState(undefined);

  const onMouseOverHandler = (_, propsData, index) => {
    setHovered(index);
    onMouseEnter && onMouseEnter(propsData[index]);
  };

  const onMouseOutHandler = () => {
    setHovered(undefined);
  };

  const onClickHandler = (event, propsData, index) => {
    onClick && onClick(propsData[index]);
  };

  const data = groupedData
    .map(item => ({ ...item, value: groupedData.length, title: item[titleField] }))
    .map((entry, i) => {
      if (hovered === i) {
        return {
          ...entry,
          color: `${entry.color}E6`
        };
      }
      return entry;
    });

  return (
    <div
      style={{
        width: size,
        height: size
      }}
    >
      <PieChart
        data={data}
        radius={50}
        style={{
          height: `${size}px`
        }}
        viewBoxSize={[size, size]}
        onClick={onClickHandler}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        onFocus={onMouseOverHandler}
        onBlur={onMouseOutHandler}
      />
    </div>
  );
};

MapGroupedMarker.defaultProps = {
  onClick: undefined,
  onMouseEnter: undefined
};

export default MapGroupedMarker;
