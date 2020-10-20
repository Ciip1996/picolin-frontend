// @flow
import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/lab/Alert';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import HistoryCard from 'UI/components/molecules/HistoryCard';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import Text from 'UI/components/atoms/Text';

import { Endpoints } from 'UI/constants/endpoints';
import { Roles } from 'UI/constants/roles';
import { EntityType } from 'UI/constants/entityTypes';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import { showAlert as showAlertAction } from 'actions/app';
import { getErrorMessage, nestTernary } from 'UI/utils';

import type { Map } from 'types';
import API from 'services/API';
import { userHasRole } from 'services/Authorization';
import { useAccountability } from 'hooks/accountability';

import { getCurrentUser } from 'services/Authentication';
import { AdditionalRecruiterType } from 'UI/constants/status';
import { styles, FieldContainer } from './styles';

type ReassignRecruiterFormProps = {
  baseEndpoint: string,
  item: any,
  entityType: any,
  onReassignCompleted: (any, any) => void,
  onReassignClosed: () => void,
  showAlert: any => void
};

const buildSelectableRecruiter = (recruiter: any) => {
  return recruiter
    ? { id: recruiter.id, full_name: recruiter.personalInformation?.full_name }
    : null;
};

const ReassignRecruiterForm = (props: ReassignRecruiterFormProps) => {
  const {
    baseEndpoint,
    item,
    entityType,
    onReassignCompleted,
    onReassignClosed,
    showAlert
  } = props;

  const currentUser = getCurrentUser();
  const isUserCoach = userHasRole(Roles.Coach);
  const isUserRecruiter = userHasRole(Roles.Recruiter);

  const { id, recruiter, created_at, createdBy, free_game: isFreeGame } = item;

  const additionalRecruitersEndpoint = `${baseEndpoint}/${id}/${Endpoints.AdditionalRecruiters}`;
  const {
    isUserRequestingAccountability,
    assistantRecruiter,
    accountableRecruiter,
    assistantForAccountableRecruiter,
    isMainCoach,
    isMainRecruiter,
    shouldShowAdditionalRecruiters,
    isTeamworkEntity,
    isAssignableEntity
  } = useAccountability(currentUser, item, entityType);
  const [comboValues, setComboValues] = useState<Map>({
    recruiterId: recruiter && buildSelectableRecruiter(recruiter),
    assistantRecruiterId:
      assistantRecruiter && buildSelectableRecruiter(assistantRecruiter?.recruiter),
    accountableRecruiterId: buildSelectableRecruiter(
      accountableRecruiter?.recruiter || (isUserRequestingAccountability && currentUser)
    ),
    assistantForAccountableRecruiterId:
      assistantForAccountableRecruiter &&
      buildSelectableRecruiter(assistantForAccountableRecruiter?.recruiter)
  });

  const defaultValues = {
    recruiterId: recruiter.id,
    assistantRecruiterId: assistantRecruiter?.recruiter?.id || null,
    accountableRecruiterId:
      accountableRecruiter?.recruiter?.id ||
      (isUserRequestingAccountability && currentUser?.id) ||
      null,
    assistantForAccountableRecruiterId: assistantForAccountableRecruiter?.recruiter?.id || null
  };

  const form = useForm({
    defaultValues
  });

  const { register, errors, setValue, getValues, triggerValidation } = form;

  const [assignmentHistory, setAssignmentHistory] = useState([]);

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false,
    isFetching: false
  });

  useEffect(() => {
    isAssignableEntity &&
      (isMainCoach || isMainRecruiter) &&
      register({ name: 'recruiterId' }, { required: 'Please select a recruiter' });
    isTeamworkEntity &&
      (isMainCoach || isMainRecruiter) &&
      register({ name: 'assistantRecruiterId' });
    shouldShowAdditionalRecruiters && register({ name: 'accountableRecruiterId' });
    shouldShowAdditionalRecruiters &&
      !isUserRequestingAccountability &&
      register({ name: 'assistantForAccountableRecruiterId' });
  }, [
    register,
    isMainCoach,
    isMainRecruiter,
    isUserCoach,
    shouldShowAdditionalRecruiters,
    isAssignableEntity,
    isTeamworkEntity,
    isUserRequestingAccountability
  ]);

  useEffect(() => {
    shouldShowAdditionalRecruiters &&
      register(
        { name: 'accountableRecruiterId' },
        {
          validate(value) {
            const collaborator = getValues().assistantForAccountableRecruiterId;
            return !collaborator || (collaborator && value) || 'Please select a recruiter';
          }
        }
      );
  }, [register, getValues, shouldShowAdditionalRecruiters]);

  useEffect(() => {
    const getAssignmentHistory = async () => {
      try {
        setUiState(prevState => ({ ...prevState, isFetching: true }));
        const response = await API.get(`${baseEndpoint}/${Endpoints.AssignmentHistory}/${id}`);

        if (response.data && response.status === 200) {
          setAssignmentHistory(response.data);
        }
      } catch (err) {
        showAlert({
          severity: 'error',
          title: 'Assignment History',
          body: getErrorMessage(err)
        });
      }
      setUiState(prevState => ({
        ...prevState,
        isFetching: false
      }));
    };
    getAssignmentHistory();
  }, [id, baseEndpoint, showAlert]);

  const handleRecruiterSelect = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    triggerValidation();
  };

  const areAllDifferent = recruiters => {
    const withValues = recruiters.filter(rcr => rcr);
    const uniqRecruiters = uniq(withValues);
    return uniqRecruiters.length === withValues.length;
  };

  const onSubmit = async formData => {
    let requestSent = false;
    let errorFound = false;
    let mainRecruiter = null;
    try {
      const {
        recruiterId = null,
        assistantRecruiterId = null,
        accountableRecruiterId = null,
        assistantForAccountableRecruiterId = null
      } = formData;

      const {
        recruiterId: prevRecruiterId = null,
        assistantRecruiterId: prevAssistantRecruiterId = null,
        accountableRecruiterId: prevAccountableRecruiterId = null,
        assistantForAccountableRecruiterId: prevAssistantForAccountableRecruiterId = null
      } = defaultValues;

      const recruiterIds = [
        recruiterId,
        assistantRecruiterId,
        accountableRecruiterId,
        assistantForAccountableRecruiterId
      ];
      if (!areAllDifferent(recruiterIds)) {
        showAlert({
          severity: 'warning',
          title: 'Collaborations',
          body: `A recruiter can be only in one assignment`
        });
        return;
      }

      const reassignEndpoint = `${baseEndpoint}/${Endpoints.Reassign}/${id}`;

      setUiState(prevState => ({ ...prevState, isSaving: true }));

      if (isAssignableEntity && recruiterId && isMainCoach && recruiterId !== prevRecruiterId) {
        const mainResponse = await API.put(reassignEndpoint, {
          recruiterId
        });
        mainRecruiter = mainResponse?.data;
        requestSent = true;
      }

      if (
        isTeamworkEntity &&
        (isMainCoach || isMainRecruiter) &&
        (assistantRecruiterId !== prevAssistantRecruiterId ||
          (recruiterId !== prevRecruiterId && assistantRecruiter))
      ) {
        const collaboratorData = {
          type: AdditionalRecruiterType.Collaborator,
          target_recruiter_id: assistantRecruiterId,
          recruiter_to_collaborate_id: recruiterId
        };
        await getCRUDRequest(assistantRecruiter, assistantRecruiterId, collaboratorData);
        requestSent = true;
      }

      /* Setting the accountableRecruiterId to null will delete the records on backend */
      if (shouldShowAdditionalRecruiters) {
        if (
          accountableRecruiterId !== prevAccountableRecruiterId ||
          isUserRequestingAccountability
        ) {
          const accountableData = {
            type: AdditionalRecruiterType.Accountable,
            target_recruiter_id: accountableRecruiterId
          };
          await getCRUDRequest(accountableRecruiter, accountableRecruiterId, accountableData);
          requestSent = true;
        }

        const accountableCollaboratorData = {
          type: AdditionalRecruiterType.Collaborator,
          target_recruiter_id: assistantForAccountableRecruiterId || null,
          recruiter_to_collaborate_id: accountableRecruiterId || prevAccountableRecruiterId || null
        };
        if (
          (!isUserRequestingAccountability &&
            assistantForAccountableRecruiterId !== prevAssistantForAccountableRecruiterId) ||
          (accountableRecruiterId !== prevAccountableRecruiterId &&
            assistantForAccountableRecruiter)
        ) {
          await getCRUDRequest(
            assistantForAccountableRecruiter,
            assistantForAccountableRecruiterId,
            accountableCollaboratorData
          );
          requestSent = true;
        }
      }
    } catch (err) {
      errorFound = true;
      showAlert({
        severity: 'error',
        title: entityType.singular,
        body: getErrorMessage(err)
      });
    }

    if (!requestSent) {
      onReassignClosed && onReassignClosed();
      return;
    }

    const updatedItem = isTeamworkEntity ? await API.get(`${baseEndpoint}/${id}?mode=slim`) : null;

    if (!errorFound && requestSent) {
      showAlert({
        severity: 'success',
        title: 'Awesome',
        body: `The ${entityType.singular} was assigned successfully`
      });
    }
    onReassignCompleted && onReassignCompleted(mainRecruiter, updatedItem?.data);
  };

  const history = [
    ...assignmentHistory,
    {
      id: null,
      date: created_at,
      creator: createdBy?.personalInformation?.full_name,
      recruiter: null,
      type: 'create',
      action: ''
    }
  ];

  const getCRUDRequest = (previousRecruiter, updatedRecruiterId, assignmentData) => {
    const method = previousRecruiter ? nestTernary(!!updatedRecruiterId, 'put', 'delete') : 'post';
    const previousRecruiterId = previousRecruiter && previousRecruiter.id;
    const url =
      method === 'post'
        ? additionalRecruitersEndpoint
        : `${additionalRecruitersEndpoint}/${previousRecruiterId || ''}`;
    return API({ method, url, data: assignmentData });
  };

  return (
    <FormContext {...form}>
      <DrawerFormLayout
        title={
          isUserCoach
            ? `Recruiter assignments`
            : nestTernary(
                isUserRequestingAccountability,
                nestTernary(
                  entityType.id === EntityType.Candidate,
                  'Start marketing',
                  'Start recruiting'
                ),
                'Collaboration request'
              )
        }
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onReassignClosed}
        uiState={uiState}
      >
        {isMainCoach && isAssignableEntity && (
          <FieldContainer>
            <Text variant="subtitle1" text="Assign this item to:" />
            <AutocompleteSelect
              name="recruiterId"
              placeholder="Recruiter"
              url={`${Endpoints.Recruiters}/myTeam`}
              selectedValue={comboValues.recruiterId}
              displayKey="full_name"
              onSelect={handleRecruiterSelect}
              error={!!errors.recruiterId}
              errorText={errors.recruiterId && errors.recruiterId.message}
            />
          </FieldContainer>
        )}
        {isTeamworkEntity && (isMainCoach || isMainRecruiter) && (
          <FieldContainer>
            <Text
              variant="subtitle1"
              text={
                isMainCoach
                  ? 'Assign a recruiter to collaborate:'
                  : 'Choose a recruiter to collaborate with:'
              }
            />
            <AutocompleteSelect
              name="assistantRecruiterId"
              placeholder="Recruiter"
              url={`${Endpoints.Recruiters}/myTeam`}
              selectedValue={comboValues.assistantRecruiterId}
              displayKey="full_name"
              onSelect={handleRecruiterSelect}
              error={!!errors.assistantRecruiterId}
              errorText={errors.assistantRecruiterId && errors.assistantRecruiterId.message}
            />
          </FieldContainer>
        )}

        {shouldShowAdditionalRecruiters && (
          <>
            {isMainCoach && <Divider style={styles.divider} />}
            {isUserRequestingAccountability && (
              <Box mb={2}>
                <Alert severity="warning">
                  Once you start working this item, you&#39;ll start receiving notifications as you
                  become accountable for it
                </Alert>
              </Box>
            )}

            {(isUserCoach || isFreeGame) && (
              <FieldContainer>
                <Text
                  variant="subtitle1"
                  text={
                    isMainCoach
                      ? 'Assign this item also to:'
                      : nestTernary(
                          isUserCoach,
                          'Assign this item to:',
                          'New accountable recruiter'
                        )
                  }
                />
                <AutocompleteSelect
                  name="accountableRecruiterId"
                  placeholder="Recruiter"
                  url={`${Endpoints.Recruiters}/myTeam`}
                  selectedValue={comboValues.accountableRecruiterId}
                  displayKey="full_name"
                  onSelect={handleRecruiterSelect}
                  error={!!errors.accountableRecruiterId}
                  errorText={errors.accountableRecruiterId && errors.accountableRecruiterId.message}
                  disabled={isFreeGame && isUserRecruiter}
                />
              </FieldContainer>
            )}
            {!isUserRequestingAccountability && (
              <FieldContainer>
                <Text
                  variant="subtitle1"
                  text={
                    isUserCoach
                      ? 'Assign a recruiter to collaborate:'
                      : 'Choose a recruiter to collaborate with:'
                  }
                />
                <AutocompleteSelect
                  name="assistantForAccountableRecruiterId"
                  placeholder="Recruiter"
                  url={`${Endpoints.Recruiters}/myTeam`}
                  selectedValue={comboValues.assistantForAccountableRecruiterId}
                  displayKey="full_name"
                  onSelect={handleRecruiterSelect}
                  error={!!errors.assistantForAccountableRecruiterId}
                  errorText={
                    errors.assistantForAccountableRecruiterId &&
                    errors.assistantForAccountableRecruiterId.message
                  }
                />
              </FieldContainer>
            )}
          </>
        )}
        <Divider style={styles.divider} />
        <Box style={styles.historyContainer}>
          <Text variant="subtitle1" text="Assignment history:" />
          <Box mt={1}>
            {uiState.isFetching ? (
              <HistoryCard isLoading />
            ) : (
              <>
                {history.map((entry: Object, index: number) => {
                  const {
                    id: itemId,
                    recruiter: targetUser,
                    creator,
                    other_recruiter: otherRecruiter,
                    date,
                    type,
                    action
                  } = entry;
                  return (
                    <div key={itemId}>
                      <HistoryCard
                        creator={creator}
                        recruiter={targetUser}
                        otherRecruiter={otherRecruiter}
                        date={date}
                        type={type}
                        action={action}
                      />
                      {index < history.length - 1 && <Divider style={styles.tightDivider} />}
                    </div>
                  );
                })}
                {history.length === 0 && (
                  <EmptyPlaceholder
                    title="Not reassigned yet"
                    subtitle="there have been no reassignments previously."
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </DrawerFormLayout>
    </FormContext>
  );
};

ReassignRecruiterForm.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const ReassignRecruiterConnected = connect(null, mapDispatchToProps)(ReassignRecruiterForm);

export default ReassignRecruiterConnected;
