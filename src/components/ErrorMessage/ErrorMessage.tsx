import React from 'react';
import cN from 'classnames';

type Props = {
  errorText: null | string,
  clearError: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ errorText, clearError }) => (
  <div
    className={cN('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorText,
    })}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      type="button"
      className="delete"
      onClick={clearError}
    />
    {errorText}
  </div>
);
