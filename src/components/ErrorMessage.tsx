/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../types/Error';

type Props = {
  errorType: ErrorType | null;
  onErrorClose: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ errorType, onErrorClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        ' is-danger',
        ' is-light',
        ' has-text-weight-normal',
        { hidden: !errorType },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onErrorClose}
      />

      {`${errorType}`}
    </div>
  );
};
