import { useEffect } from 'react';
import classNames from 'classnames';
import { useTodos } from '../../context';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorList = () => {
  const { errors, setErrors } = useTodos();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrors(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errors, setErrors]);

  const handleClick = () => {
    setErrors(null);
  };

  //  {/* Notification is shown in case of any error */}
  // {/* Add the 'hidden' class to hide the message smoothly */}

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errors },
      )}
      style={{
        transitionProperty: 'opacity,min-height',
        transitionDuration: '1s',
        transitionTimingFunction: 'ease-out',
      }}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide error"
        onClick={handleClick}
      />
      {/* show only one message at a time */}
      {errors}
    </div>
  );
};
