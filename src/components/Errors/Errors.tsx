import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  setError: (v: string) => void;
};

export const Errors: React.FC<Props> = ({ error, setError }) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      setError('');
    }, 3000);
  }, []);

  return (
    <>
      {visible && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
          )}
        >
          <button
            type="button"
            className="delete"
            aria-label="Close error"
            onClick={() => {
              setVisible(false);
            }}
          />

          {error}

          {/* show only one message at a time */}
          {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
        </div>
      )}
    </>
  );
};
