import classNames from 'classnames';
import { useEffect, useLayoutEffect, useState } from 'react';

interface Props {
  message: string;
}

export const ErrorNotification: React.FC<Props> = ({ message }) => {
  const [stateError, setStateError] = useState(false);

  useLayoutEffect(() => {
    if (message) {
      setStateError(true);
    }
  }, [message]);

  useEffect(() => {
    if (stateError) {
      setTimeout(() => {
        setStateError(false);
      }, 3000);
    }
  }, [stateError]);

  const hideNotification = () => {
    setStateError(prev => !prev);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !stateError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideNotification}
      />
      {message}
      {/* show only one message at a time
          Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
    </div>
  );
};
