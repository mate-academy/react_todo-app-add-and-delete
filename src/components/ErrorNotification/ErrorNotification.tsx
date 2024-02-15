/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../State/TodoContext';

export const ErrorNotification: React.FC = () => {
  const {
    isError,
    setIsError,
    errorText,
  } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {isError && (
        <span>{errorText}</span>
      )}
      {/* <br />
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
