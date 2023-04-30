import React from 'react';
import classNames from 'classnames';

type Props = {
  getDataError: boolean,
  postDataError: boolean,
  deleteDataError: boolean,
  inputState: boolean,
  disableErrorHandling: () => void,
};

export const Error: React.FC<Props> = ({
  getDataError,
  postDataError,
  deleteDataError,
  inputState,
  disableErrorHandling,
}) => {
  const isHidden = !getDataError
  && !postDataError
  && !deleteDataError
  && !inputState;

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => disableErrorHandling()}
      />

      {getDataError && 'Error, can\'t get todos from server'}
      {postDataError && 'Unable to add a todo'}
      {deleteDataError && 'Unable to delete a todo'}
      {inputState && 'Title can\'t be empty'}
    </div>
  );
};
