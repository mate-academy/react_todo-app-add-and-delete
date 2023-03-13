import React, { useEffect } from 'react';

type Props = {
  error: string;
  removeError: () => void
};
export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  removeError,
}) => {
  useEffect(() => {
    setTimeout(removeError, 3000);
  }, []);

  return (
    <>
      <div className="notification is-danger is-light has-text-weight-normal">
        {/* // eslint-disable-next-line */}
        <button
          type="button"
          className="delete"
          onClick={removeError}
          aria-label="An error message"
        />
        {error}
      </div>
    </>
  );
});
