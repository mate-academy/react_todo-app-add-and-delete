import React from 'react';

type Props = {
  errorType: string,
};

export const Notification: React.FC<Props> = ({
  errorType,
}) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        aria-label="delete-button"
        type="button"
        className="delete"
      />

      {/* show only one message at a time */}
      {`Unable to ${errorType} a todo`}
    </div>
  );
};
