import React from 'react';

type Props = {
  error: string | null;
  hidden: boolean;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  hidden,
  onHide,
}) => (
  <div
    role="alert"
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${
      hidden ? 'hidden' : ''
    }`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
    {error || ''}
  </div>
);
