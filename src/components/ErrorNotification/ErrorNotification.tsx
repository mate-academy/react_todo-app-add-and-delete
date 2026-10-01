import React from 'react';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  message: string;
  hidden: boolean;
  onClose: () => void;
}

export default function ErrorNotification({ message, hidden, onClose }: Props) {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        hidden ? 'hidden' : ''
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
}
