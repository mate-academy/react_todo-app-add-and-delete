import classNames from 'classnames';
import React from 'react';
import { UseTodosContext } from '../../utils/TodosContext';
import { ErrorMessages } from '../../types/ErrorMessages';

const ERROR_MESSAGE_DISSAPEAR_DELAY = 3000;

type Props = {};

export const TodoErrorMessage: React.FC<Props> = () => {
  const context = UseTodosContext();

  const {
    errorMessage,
    setErrorMessage,
  } = context;

  const removeErrorMessage = () => setErrorMessage(ErrorMessages.Default);

  if (errorMessage) {
    setTimeout(removeErrorMessage, ERROR_MESSAGE_DISSAPEAR_DELAY);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        onClick={removeErrorMessage}
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
