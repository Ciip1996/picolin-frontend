/* eslint-disable jsx-a11y/label-has-associated-control */
// @flow
import React from 'react';
import { styles } from './styles';

type FileSelectorButtonProps = {
  onFileChange: (fileEvent: any) => void,
  children?: any
};

const FileSelectorButton = (props: FileSelectorButtonProps) => {
  const { onFileChange, children } = props;

  return (
    <div style={styles.root}>
      <input
        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/pdf,image/*"
        style={styles.input}
        id="contained-button-file"
        type="file"
        onChange={onFileChange}
      />
      <label htmlFor="contained-button-file" style={styles.lable}>
        {children}
      </label>
    </div>
  );
};

FileSelectorButton.defaultProps = {
  children: undefined
};

export default FileSelectorButton;
