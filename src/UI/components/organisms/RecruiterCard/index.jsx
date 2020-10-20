// @flow
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import InfoLabel from 'UI/components/molecules/InfoLabel';
import CustomSkeleton from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/CustomSkeleton';
import { RecruiterBarMode } from 'UI/constants/defaults';
import { globalStyles } from 'GlobalStyles';
import { fuseStyles } from 'UI/utils';
import { styles, useCardHeaderStyles } from './styles';

type RecruiterCardProps = {
  recruiter: any,
  coach: any,
  assistant: any,
  date: string,
  mode: 'compact' | 'large',
  isLoading: boolean
};

const RecruiterCard = (props: RecruiterCardProps) => {
  const { recruiter, coach, assistant, date, isLoading, mode } = props;
  const [uiState, setUiState] = useState({
    isExpanded: false
  });

  const cardHeaderClasses = useCardHeaderStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only('xs'));

  const collapse = () => {
    setUiState(prevState => ({
      ...prevState,
      isExpanded: false
    }));
  };

  const expand = () => {
    !isLoading &&
      setUiState(prevState => ({
        ...prevState,
        isExpanded: true
      }));
  };

  const cardStyles = fuseStyles([
    globalStyles.cardContainer,
    isLoading && styles.skeleton,
    isXS && styles.stacked,
    !isXS && uiState.isExpanded && mode === RecruiterBarMode.Compact
      ? styles.overlay
      : styles.stacked
  ]);

  return (
    <Box style={styles.container}>
      <Card style={cardStyles} onMouseEnter={expand} onMouseLeave={collapse}>
        <CardHeader
          classes={cardHeaderClasses}
          avatar={
            isLoading ? (
              <CustomSkeleton onContainer variant="circle" width={40} height={40} />
            ) : (
              <CustomAvatar acron={recruiter?.initials} />
            )
          }
          title={
            mode === RecruiterBarMode.Compact ? (
              <InfoLabel
                title="Recruiter"
                titleLabel={recruiter?.personalInformation?.full_name}
                description={recruiter?.personalInformation?.full_name}
              />
            ) : (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <InfoLabel
                      title="Recruiter"
                      titleLabel={recruiter?.personalInformation?.full_name}
                      description={recruiter?.personalInformation?.full_name}
                      isLoading={isLoading}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InfoLabel
                      title="Coach"
                      titleLabel={coach?.full_name}
                      description={coach?.full_name}
                      isLoading={isLoading}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InfoLabel
                      title="Added date"
                      titleLabel={date}
                      description={date}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>
                <Collapse in={uiState.isExpanded} timeout={isXS ? 'auto' : 0} unmountOnExit>
                  <Grid container spacing={1} style={{ marginTop: 4 }}>
                    <Grid item xs={4}>
                      <InfoLabel
                        title="Ext"
                        titleLabel={recruiter?.personalInformation?.contact?.ext}
                        description={recruiter?.personalInformation?.contact?.ext}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <InfoLabel
                        title="Email"
                        titleLabel={recruiter?.email}
                        description={recruiter?.email}
                        isLoading={isLoading}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </>
            )
          }
          action={
            isLoading ? (
              <CustomIconButton>
                <CustomSkeleton onContainer variant="circle" width={28} height={28} />
              </CustomIconButton>
            ) : (
              <CustomIconButton onClick={collapse}>
                {uiState.isExpanded ? <ExpandLess /> : <ExpandMore />}
              </CustomIconButton>
            )
          }
          disableTypography
        />
        <Collapse in={uiState.isExpanded} timeout={isXS ? 'auto' : 0} unmountOnExit>
          {mode === RecruiterBarMode.Compact && (
            <CardContent style={styles.cardContent}>
              <Grid container>
                <Grid item xs={7}>
                  <InfoLabel
                    title="Email"
                    titleLabel={recruiter?.email}
                    description={recruiter?.email}
                  />
                </Grid>
                <Grid item xs={5}>
                  <InfoLabel
                    title="Ext"
                    titleLabel={recruiter?.personalInformation?.contact?.ext}
                    description={recruiter?.personalInformation?.contact?.ext}
                  />
                </Grid>
                <Grid item xs={7} style={{ marginTop: 4 }}>
                  <InfoLabel
                    title="Coach"
                    titleLabel={coach?.full_name}
                    description={coach?.full_name}
                  />
                </Grid>
                <Grid item xs={5} style={{ marginTop: 4 }}>
                  <InfoLabel title="Added date" titleLabel={date} description={date} />
                </Grid>
              </Grid>
            </CardContent>
          )}
          {assistant && (
            <>
              <Divider style={styles.divider} />
              <CardHeader
                avatar={<CustomAvatar acron={assistant?.initials} />}
                title={
                  <InfoLabel
                    title="Collaborator"
                    titleLabel={assistant?.personalInformation.full_name}
                    description={assistant?.personalInformation.full_name}
                  />
                }
              />
            </>
          )}
        </Collapse>
      </Card>
    </Box>
  );
};

RecruiterCard.defaultProps = {
  isLoading: false,
  mode: 'large',
  assistant: null,
  recruiter: null,
  coach: null,
  date: ''
};

export default RecruiterCard;
