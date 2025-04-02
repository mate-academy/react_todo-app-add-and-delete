import classNames from 'classnames';
import { ErrorMessage } from '../types/Todo';
import React from 'react';

type Props = {
  errorMessage: ErrorMessage;
  onHideError: () => void;
  isVisible: boolean;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  onHideError,
  isVisible,
}: Props) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isVisible },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHideError}
    />
    {/* show only one message at a time */}
    {errorMessage}
  </div>
);
