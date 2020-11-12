// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import InfoLabel from 'UI/components/molecules/InfoLabel';

import type { TabCardDefinition } from 'types/app';

import ButtonMenu from 'UI/components/molecules/ButtonMenu';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import { EditIcon, DeleteIcon, MoreIcon, colors } from 'UI/res';

import { useStyles } from './styles';
import Contents from './strings';

type ProfileTabListCardProps = {
  item: any,
  definition: TabCardDefinition,
  onEditClick: any => any,
  onItemClick: any => any,
  onDeleteClick: any => any
};

const ProfileTabListCard = (props: ProfileTabListCardProps) => {
  const { item, definition, onEditClick, onItemClick, onDeleteClick } = props;
  const language = localStorage.getItem('language');

  const classes = useStyles();

  const handleEditClick = (event: any) => {
    event.stopPropagation();
    onEditClick && onEditClick(item);
  };

  const handleItemClick = () => {
    onItemClick && onItemClick(item);
  };

  const handleDeleteClick = (event: any) => {
    event.stopPropagation();
    onDeleteClick && onDeleteClick(item);
  };

  const myInfoLabels = definition.infoLabelsResolver(item);

  const MenuItems = [
    {
      icon: <DeleteIcon fill={colors.completeBlack} />,
      title: Contents[language]?.Remove,
      action: handleDeleteClick,
      visible: onDeleteClick
    },
    {
      icon: <EditIcon fill={colors.completeBlack} />,
      title: Contents[language]?.Edit,
      action: handleEditClick,
      visible: onEditClick
    }
  ];

  return (
    <Card className={classes.root} variant="outlined">
      <div className={classes.buttonsContainer}>
        <ButtonMenu isIconButton MenuItems={MenuItems} width="200px">
          <MoreIcon size={18} fill={colors.darkGrey} />
        </ButtonMenu>
      </div>
      <CardActionArea onClick={handleItemClick}>
        <CardContent className={classes.cardContent}>
          <div className={classes.wrapper}>
            {definition.showAvatar && (
              <div className={classes.avatarWrapper}>
                <CustomAvatar
                  mode="acron"
                  acron={item.recruiter?.initials}
                  style={{ marginTop: -20 }}
                />
              </div>
            )}

            <div className={classes.content}>
              <Grid container spacing={3}>
                {myInfoLabels.map(label => {
                  return (
                    <Grid item xs={4} key={label.title}>
                      <InfoLabel
                        title={label.title}
                        description={label.description}
                        colorIndicator={label?.color}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ProfileTabListCard.defaultProps = {
  definition: { showAvatar: false, infoLabelsResolver: () => [] },
  onEditClick: undefined,
  onItemClick: undefined,
  onDeleteClick: undefined
};

export default ProfileTabListCard;
