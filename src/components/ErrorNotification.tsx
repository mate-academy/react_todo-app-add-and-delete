import React from 'react';
import classNames from 'classnames';
import { useTodos } from './TodoContext';
import { ErrorText } from '../types/ErrorText';

export const ErrorNotification: React.FC = () => {
  const { errMessage, setErrMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errMessage === ErrorText.NoErr },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrMessage(ErrorText.NoErr)}
      />
      {errMessage}
    </div>
  );
};
