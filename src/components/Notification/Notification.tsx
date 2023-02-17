/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  isError: boolean,
  errorMessage: ErrorMessages,
  onIsError: (isError: boolean) => void,
};

export const Notification:React.FC<Props> = ({
  isError,
  errorMessage,
  onIsError,
}) => (
  <div className={classNames(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !isError },
  )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => onIsError(false)}
    />

    {errorMessage}
  </div>
);
