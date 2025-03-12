import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {/* show only one message at a time */}
      {errorMessage === 'Unable to load todos' && (
        <>
          Unable to load todos
          <br />
        </>
      )}
      {errorMessage === 'Title should not be empty' && (
        <>
          Title should not be empty
          <br />
        </>
      )}
      {errorMessage === 'Unable to add a todo' && (
        <>
          Unable to add a todo
          <br />
        </>
      )}
      {errorMessage === 'Unable to delete a todo' && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}
      {errorMessage === 'Unable to update a todo' && (
        <>
          Unable to update a todo
          <br />
        </>
      )}
    </div>
  );
};
