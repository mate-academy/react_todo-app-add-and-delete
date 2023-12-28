import { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodoContext';

export const Errors = () => {
  const { errorOccured, setErrorOccured } = useContext(TodoContext);

  return (
    <>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorOccured },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorOccured('')}
          aria-label="whatEver"
        />
        {errorOccured}
      </div>
    </>
  );
};
