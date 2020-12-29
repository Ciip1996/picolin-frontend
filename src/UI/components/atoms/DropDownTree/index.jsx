// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { colors, PlusIcon } from 'UI/res/';
import { useStylesTreeView, useStyles } from './styles';

const FileSystemNavigator = () => {
  const classes = useStylesTreeView();

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
        <TreeItem nodeId="3" label="Chrome" />
        <TreeItem nodeId="4" label="Webstorm" />
      </TreeItem>

      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="11" label="OSS" />
        <TreeItem nodeId="12" label="OSS" />
        <TreeItem nodeId="13" label="OSS" />

        <TreeItem nodeId="6" label="Material-UI">
          <TreeItem nodeId="7" label="src">
            <TreeItem nodeId="8" label="index.js" />
            <TreeItem nodeId="14" label="tree-view.js" />
            <TreeItem nodeId="15" label="tree-view.js" />

            <TreeItem nodeId="16" label="tree-view.js" />
            <TreeItem nodeId="17" label="tree-view.js" />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
};

type DropDownTreeProps = {
  onClick: () => any
};

const DropDownTree = (props: DropDownTreeProps) => {
  const { onClick } = props;
  const classes = useStyles();
  const [template, setTemplate] = React.useState();

  const handleChange = event => {
    setTemplate(event.target.value);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Select
          variant="outlined"
          value={template}
          onChange={handleChange}
          className={classes.select}
          id="grouped-select"
        >
          <MenuItem onClick={onClick} className={classes.firstMenu} value="New Template">
            <Button
              color="primary"
              className={classes.button}
              startIcon={<PlusIcon size={15} fill={colors.success} />}
            >
              Add New Template
            </Button>
          </MenuItem>
          <FileSystemNavigator />
        </Select>
      </FormControl>
    </div>
  );
};

DropDownTree.defaultProps = {
  onClick: () => {}
};

export default DropDownTree;
