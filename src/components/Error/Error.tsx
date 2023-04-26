import React from 'react';
import classNames from 'classnames';

type Props = {
  error: boolean,
  getDataError: boolean,
  postDataError: boolean,
  deleteDataError: boolean,
  inputState: boolean,
  handleErrorState: (value: React.SetStateAction<boolean>) => void
};

export const Error: React.FC<Props> = ({
  error,
  getDataError,
  postDataError,
  deleteDataError,
  inputState,
  handleErrorState,
}) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => handleErrorState(false)}
      />

      {getDataError && 'Error, can\'t get todos from server'}
      {postDataError && 'Unable to add a todo'}
      {deleteDataError && 'Unable to delete a todo'}
      {inputState && 'Title can\'t be empty'}
    </div>
  );
};
