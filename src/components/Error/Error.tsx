/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useSignals } from '@preact/signals-react/runtime';
import { effect } from '@preact/signals-react';
import { isError } from '../../signals';
import { ErrorValues } from '../../types/ErrorValues';

effect(() => {
  if (isError.value) {
    setTimeout(() => {
      isError.value = null;
    }, 3000);
  }
});

export const Error = () => {
  useSignals();

  const errorMessage = () => {
    switch (isError.value) {
      case ErrorValues.load:
        return 'Unable to load todos';
      case ErrorValues.emptyTitle:
        return 'Title should not be empty';
      case ErrorValues.add:
        return 'Unable to add a todo';
      case ErrorValues.delete:
        return 'Unable to delete a todo';
      case ErrorValues.update:
        return 'Unable to update a todo';
      default:
        return null;
    }
  };

  const showError = errorMessage();

  return (
  //     {/* Notification is shown in case of any error */}
  // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError.value },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          isError.value = null;
        }}
      />
      {/* show only one message at a time */}
      {showError}
    </div>
  );
};
