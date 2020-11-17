// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import InfoLabel from 'UI/components/molecules/InfoLabel';
import Text from 'UI/components/atoms/Text';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import SocialNetworkButton from 'UI/components/molecules/SocialNetworkButton';
import {
  EditIcon,
  WriteUpIcon,
  MailIcon,
  PhoneCallIcon,
  SMSIcon,
  PersonsIcon,
  MoreIcon,
  colors
} from 'UI/res';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { getCurrentUser } from 'services/Authentication';
import { canUserEditEntity, userHasRole } from 'services/Authorization';

import { Roles } from 'UI/constants/roles';
import { EntityType } from 'UI/constants/entityTypes';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import ButtonMenu from 'UI/components/molecules/ButtonMenu';
import { useHistory } from 'react-router-dom';
import { EntityRoutes } from 'routes/constants';

import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';
import { useStyles, styles } from './styles';

const featureFlags = getFeatureFlags();

type ProfileViewProps = {
  name: string,
  infoLabels: any[],
  sheet: any,
  profile: any,
  type: 'candidate' | 'joborder' | 'company' | 'name' | 'hiring authority',
  onDatasheetClick: (readOnly: boolean) => any,
  onEditClick: () => any,
  onReassignClick: () => any
};

const ProfileView = (props: ProfileViewProps) => {
  const { infoLabels, name, type, sheet, profile, onDatasheetClick, onEditClick } = props;

  const currentUser = getCurrentUser();
  const classes = useStyles();
  const history = useHistory();

  const autocompleteRest = {
    disabledItemsFocusable: true,
    style: {
      alignItems: 'unset'
    }
  };
  const canEdit = canUserEditEntity(currentUser, profile);
  const isUserCoach = userHasRole(Roles.Coach);

  const MenuItems = [
    {
      icon: <PhoneCallIcon fill={colors.black} />,
      title: 'Call',
      action: () => {},
      visible: featureFlags.includes(FeatureFlags.Activity)
    },
    {
      icon: <SMSIcon fill={colors.black} />,
      title: 'SMS',
      action: () => {},
      visible: featureFlags.includes(FeatureFlags.Activity)
    },
    {
      icon: <MailIcon fill={colors.black} />,
      title: 'Email',
      action: () => {},
      visible: featureFlags.includes(FeatureFlags.Activity)
    },
    {
      icon: <PersonsIcon fill={colors.black} />,
      title: 'Recreate as Hiring A.',
      action: () => {
        history.push(EntityRoutes.HiringAuthorityCreate, profile);
      },
      visible:
        isUserCoach &&
        canEdit &&
        type === EntityType.Candidate &&
        featureFlags.includes(FeatureFlags.Names)
    },
    {
      icon: <EditIcon fill={colors.completeBlack} />,
      title: 'Edit',
      action: onEditClick,
      visible: canEdit
    }
  ];

  return (
    <Card className={classes.root}>
      <Card className={classes.wrapper}>
        <div className={classes.header}>
          <Box display="flex">
            {sheet && (
              <Tooltip
                title={
                  sheet?.candidateType?.title ||
                  sheet?.jobOrderType?.title ||
                  sheet?.companyType?.title
                }
              >
                <div className={classes.alignIndicator}>
                  <ColorIndicator
                    color={
                      sheet?.candidateType?.style_class_name ||
                      sheet?.jobOrderType?.style_class_name ||
                      sheet?.companyType?.style_class_name
                    }
                    width={15}
                    height={15}
                  />
                </div>
              </Tooltip>
            )}
            <Text variant="h2" text={name} customStyle={{ marginLeft: '10px' }} />
          </Box>
          <ButtonMenu
            style={styles.headerIcon}
            onClick={onEditClick}
            isIconButton
            MenuItems={MenuItems}
            width="200px"
          >
            <MoreIcon size={18} fill={colors.darkGrey} />
          </ButtonMenu>
        </div>
        <div className={classes.body}>
          <Grid container spacing={3} style={styles.profileScroll}>
            <>
              {infoLabels.map(each => {
                return (
                  <Grid item xs={6} key={each.title}>
                    <InfoLabel title={each.title} description={each.description} />
                  </Grid>
                );
              })}
              {type !== EntityType.Joborder && profile?.link_profile && (
                <Grid item xs={6}>
                  <SocialNetworkButton type="linkedin" url={profile.link_profile} />
                </Grid>
              )}
            </>
          </Grid>
        </div>
        {(type === EntityType.Candidate || type === EntityType.Joborder) && (
          <>
            <div className={classes.footer}>
              <div className={classes.header} style={styles.bottomHeader}>
                <ActionButton text="WRITE UP" onClick={() => onDatasheetClick(true)}>
                  <WriteUpIcon fill={colors.white} />
                </ActionButton>
                <div />
                {canEdit && (
                  <CustomIconButton
                    style={styles.headerIcon}
                    tooltipPosition="left"
                    tooltipText="Edit"
                    onClick={() => onDatasheetClick(false)}
                  >
                    <EditIcon fill={colors.black} />
                  </CustomIconButton>
                )}
              </div>
              <div className={classes.formWrapper}>
                <Text variant="body2" fontSize={16} fontWeight={300} text="Compensation Range" />

                {sheet && (
                  <>
                    <AutocompleteSelect
                      width="100%"
                      multiple
                      name="bar"
                      selectedValue={[
                        {
                          title: `Low $${
                            sheet.minimum_salary ? sheet.minimum_salary : sheet.minimum_compensation
                          } USD`
                        },
                        {
                          title: `High $${
                            sheet.good_salary ? sheet.good_salary : sheet.maximum_compensation
                          } USD`
                        },
                        {
                          title: `Ideal $${
                            sheet.no_brainer_salary
                              ? sheet.no_brainer_salary
                              : sheet.good_compensation
                          } USD`
                        }
                      ]}
                      url=""
                      {...autocompleteRest}
                    />
                    {type === EntityType.Candidate ? (
                      <div className={classes.labelContainer}>
                        <Text
                          variant="body2"
                          fontSize={16}
                          fontWeight={300}
                          text="Open To Relocation: "
                        />
                        <Text
                          variant="body2"
                          text={sheet.relocation ? 'Yes' : 'No'}
                          customStyle={
                            sheet.relocation ? styles.relocationYesLabel : styles.relocationNoLabel
                          }
                        />
                      </div>
                    ) : (
                      ''
                    )}
                    {sheet.relocations && (
                      <AutocompleteSelect
                        width="100%"
                        multiple
                        name="foo"
                        selectedValue={sheet.relocations.map(rel => ({
                          title: `${rel.city.title}${
                            !rel.city.is_state ? `, ${rel.city.state.slug}` : ''
                          }`
                        }))}
                        url=""
                        {...autocompleteRest}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </Card>
  );
};

ProfileView.defaultProps = {
  name: '',
  onDatasheetClick: () => {},
  onEditClick: () => {},
  onReassignClick: () => {},
  sheet: null
};

export default ProfileView;
