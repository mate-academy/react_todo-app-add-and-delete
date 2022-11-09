import React from 'react';
import { ErrorsType } from '../types/ErrorsType';

type Props = {
  clearError: () => void,
  errors: ErrorsType[]
};

export const Errors: React.FC<Props> = ({
  clearError,
  errors,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />

      {errors.includes(ErrorsType.Title) && (
        <p>
          Title can&apos;t be empty
        </p>
      )}

      {errors.includes(ErrorsType.Add) && (
        <>
          <br />
          <p>
            Unable to add a todo
          </p>
        </>
      )}

      {errors.includes(ErrorsType.Delete) && (
        <>
          <br />
          <p>
            Unable to delete a todo
          </p>
        </>
      )}

      {errors.includes(ErrorsType.Update) && (
        <>
          <br />
          <p>
            Unable to update a todo
          </p>
        </>
      )}
    </div>
  );
};
