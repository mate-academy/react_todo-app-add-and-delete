import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    {[
      <button
        key="button"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />,
      errorMessage,
    ]}
  </div>
);
