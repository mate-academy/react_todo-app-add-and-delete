import { useState } from 'react';
import classnames from 'classnames';

export enum ErrorText {
  Delete = 'Unable to delete a todo',
  Add = 'Unable to add a todo',
  Update = 'Unable to update a todo',
  Title = 'Please add valid title',
  Data = 'Unable to load data',
  noUser = 'No user found',
  Load = 'Unable to load todos',
}

type Props = {
  error: ErrorText;
  setError: (errorMessage: ErrorText | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  const [errorText] = useState(ErrorText.Delete);

  const closeError = () => {
    setError(null);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {error && errorText}
    </div>
  );
};
