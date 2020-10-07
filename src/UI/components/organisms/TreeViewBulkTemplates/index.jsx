// @flow
import React from 'react';

import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';

import { treeViewFolders } from 'UI/constants/mockData';
import { useStyles } from './styles';
import './styles.css';

export default function TreeViewBulkTemplates() {
  const classes = useStyles();
  const fields = {
    dataSource: treeViewFolders,
    id: 'id',
    text: 'name',
    child: 'subFolders',
    imageUrl: 'image'
  };

  return (
    <div className={classes.root}>
      <TreeViewComponent id="treeview" fields={fields} allowEditing sortOrder="Ascending" />
    </div>
  );
}
