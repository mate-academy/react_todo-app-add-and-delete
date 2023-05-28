/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  typeError: string,
};

export const ErrorMessages: React.FC<Props> = ({ typeError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" />

      {/* show only one message at a time */}
      {typeError}
      <br />
    </div>
  );
};
