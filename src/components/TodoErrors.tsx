/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../states/Global';
import { ActionType } from '../states/Reducer';
import { ErrorType } from '../types/ErrorType';

export const TodoErrors: React.FC = () => {
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const isError = useMemo(() => {
    return error !== null;
  }, [error]);

  const getErrorText = () => {
    switch (error) {
      case ErrorType.LoadError:
        return 'Unable to load todos';
      case ErrorType.TitleError:
        return 'Title should not be empty';
      case ErrorType.CreateError:
        return 'Unable to add a todo';
      case ErrorType.UpdateError:
        return 'Unable to update a todo';
      case ErrorType.DeleteError:
        return 'Unable to delete a todo';
      default:
        return '';
    }
  };

  const resetErrors = () => dispatch(
    {
      type: ActionType.ResetErrors,
      payload: { },
    },
  );

  return (
    // Notification is shown in case of any error
    // Add the 'hidden' class to hide the message smoothly
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger is-light',
        'has-text-weight-normal', {
          hidden: !isError,
        },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetErrors}
      />

      {getErrorText()}
    </div>
  );
};
