// @flow
import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Text from 'UI/components/atoms/Text';
import ButtonMenu from 'UI/components/molecules/ButtonMenu';
import { DeleteIcon, EditIcon, MoreIcon, colors } from 'UI/res';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import { DateFormats } from 'UI/constants/defaults';
import { getCurrentUser } from 'services/Authentication';
import { doesUserOwnItem } from 'services/Authorization';
import { toLocalTime } from 'UI/utils';
import { useStyles, styles } from './styles';

type ActivityNoteCardProps = {
  item: any,
  title: string,
  onDeleteClick: number => any,
  onEditClick: number => any,
  onClick: number => any
};

const ActivityNoteCard = (props: ActivityNoteCardProps) => {
  const { item, title, onDeleteClick, onEditClick, onClick } = props;
  const currentUser = getCurrentUser();

  const { id, body, user, created_at } = item;
  const { initials } = user;

  const handleDeleteClick = () => {
    onDeleteClick(id);
  };

  const handleEditClick = () => {
    onEditClick(id);
  };

  const handleClick = () => {
    onClick(id);
  };

  const classes = useStyles();
  const localTime = toLocalTime(created_at);
  const formattedDate = localTime && localTime.format(DateFormats.SimpleDateTime);

  const MenuItems = [
    {
      icon: <DeleteIcon fill={colors.completeBlack} />,
      title: 'Delete',
      action: handleDeleteClick,
      visible: onDeleteClick
    },
    {
      icon: <EditIcon fill={colors.completeBlack} />,
      title: 'Edit',
      action: handleEditClick,
      visible: onEditClick
    }
  ];

  const canManage = doesUserOwnItem(currentUser, item);

  return (
    <Card className={classes.root} variant="outlined">
      {canManage && (
        <div className={classes.buttonsContainer}>
          <ButtonMenu isIconButton MenuItems={MenuItems} width="200px">
            <MoreIcon size={18} fill={colors.darkGrey} />
          </ButtonMenu>
        </div>
      )}
      <CardActionArea>
        <CardContent onClick={handleClick}>
          <div className={classes.wrapper}>
            <div className={classes.avatarWrapper}>
              <CustomAvatar mode="acron" acron={initials} style={{ marginTop: -20 }} />
            </div>
            <div className={classes.content}>
              <Text variant="body2" text={formattedDate || ''} customStyle={styles.regularLabel} />
              <Text variant="subtitle1" text={title} />
              <div
                style={styles.htmlContent}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: body
                }}
              />
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ActivityNoteCard.defaultProps = {};

export default ActivityNoteCard;
