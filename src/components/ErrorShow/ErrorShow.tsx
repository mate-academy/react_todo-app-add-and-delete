import React, {
// useEffect,
// useState,
} from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import './ErrorHide.scss';

interface Props {
  errorToShow: ErrorType;
  setErrorToShow: React.Dispatch<React.SetStateAction<ErrorType>>;
  // hideError: () => void;
  // handleHideError: any;
  timerId: () => NodeJS.Timeout,
}

enum ErrorMessage {
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  none = '',
  emptyTitle = 'Title can\'t be empty',
}

export const ErrorShow: React.FC<Props> = ({
  errorToShow,
  setErrorToShow,
  // hideError,
  // handleHideError,
  timerId,
}) => {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorBlock = document.getElementById('#error');
  const timer = timerId();

  const hideError = () => {
    errorBlock?.classList.add('hideNow');
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearTimeout(timer);
      setErrorToShow('none');
    }, 500);
  };

  const handleHideError = () => {
    hideError();
  };

  return (
    <>
      {errorToShow !== 'none' && (
        <div
          className={classNames(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            'show',
            'hide',
          )}
          id="error"
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={handleHideError}
          />
          { ErrorMessage[errorToShow] }
        </div>
      )}
    </>
  );
};
