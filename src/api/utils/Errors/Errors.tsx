import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../TodoContext';

export const Errors:React.FC = () => {
  const {
    error,
    setError,
  } = useContext(TodosContext);

  const handelClearError = () => {
    setError(null);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handelClearError}
      />
      {error}
    </div>
  );
};
