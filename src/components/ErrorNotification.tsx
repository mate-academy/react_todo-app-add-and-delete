import React from 'react';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { ErrText } from '../types/ErrText';

export const ErrorNotification: React.FC = () => {
  const { errMessage, setErrMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: errMessage === ErrText.NoErr,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrMessage(ErrText.NoErr)}
      />
      {errMessage}
    </div>
  );
};
