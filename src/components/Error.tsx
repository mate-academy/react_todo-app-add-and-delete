import classNames from 'classnames';

import { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

export const Error: React.FC = () => {
  const { setErrorMessage, errorMessage } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
