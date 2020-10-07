export const flex = {
  display: 'flex'
};

// alignProperty

export const flexAlignCenter = {
  ...flex,
  alignItems: 'center'
};

export const flexAlignStart = {
  ...flex,
  alignItems: 'flex-start'
};

export const flexAlignEnd = {
  ...flex,
  alignItems: 'flex-end'
};

// alignCenter + custom justifyProperty

export const flexAlignCenterSpaceBetween = {
  ...flexAlignCenter,
  justifyContent: 'space-between'
};

export const flexAlignCenterSpaceAround = {
  ...flexAlignCenter,
  justifyContent: 'space-around'
};

export const flexAlignCenterFlexStart = {
  ...flexAlignCenter,
  justifyContent: 'flex-start'
};

export const flexAlignCenterFlexEnd = {
  ...flexAlignCenter,
  justifyContent: 'flex-end'
};

export const whiteSpace = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'flow-root'
};
