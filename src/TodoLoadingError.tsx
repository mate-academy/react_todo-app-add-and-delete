/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable linebreak-style */
import React from 'react';

export const TodoLoadingError: React.FC = () => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <label htmlFor="error-notification" className="notification__label">
        <button
          type="button"
          className="delete"
          id="error-notification"
        />
        Something is wrong
      </label>
    </div>
  );
};
