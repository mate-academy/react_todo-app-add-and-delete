import { Dispatch, SetStateAction } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  error: ErrorTypes,
  setError: Dispatch<SetStateAction<ErrorTypes | null>>,
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Error Notification"
        onClick={() => setError(null)}
      />
      {error === ErrorTypes.LOAD_ALL_TODOS ? 'Unable to load todos' : null}
      {error === ErrorTypes.TITLE ? 'Title should not be empty' : null}
      {error === ErrorTypes.ADD_TODO ? 'Unable to add a todo' : null}
      {error === ErrorTypes.DELETE_TODO ? 'Unable to delete a todo' : null}
      {error === ErrorTypes.UPDATE_TODO ? 'Unable to update a todo' : null}
    </div>
  );
};
