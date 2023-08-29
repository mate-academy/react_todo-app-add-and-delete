/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Error } from '../../types/Error';
import { useTodo } from '../../api/useTodo';

export const Notification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodo();
  const timeoutId = useRef<number | undefined>(0);

  useEffect(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId.current);
    }

    if (errorMessage !== Error.Absent) {
      timeoutId.current = window.setTimeout(
        () => setErrorMessage(Error.Absent), 3000,
      );
    }

    return () => {
      window.clearTimeout(timeoutId.current);
    };
  }, [errorMessage]);

  return (
    <div
      className={
        classNames('notification is-danger is-light has-text-weight-normal')
      }
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.Absent)}
      />
      {errorMessage}
    </div>
  );
};
