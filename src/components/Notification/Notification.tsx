/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  message: Errors;
  close: () => void;
};

export const Notification: React.FC<Props> = ({ message, close }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={close}
      />
      {message}
    </div>
  );
};
