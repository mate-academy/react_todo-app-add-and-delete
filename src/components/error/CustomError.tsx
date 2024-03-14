import classNames from 'classnames';
import React, { useContext } from 'react';
import { MyContext, MyContextData } from '../context/myContext';

export const CustomError: React.FC = () => {
  const { error, handleSetError } = useContext(MyContext) as MyContextData;
  const handleClick = () => {
    handleSetError('');
  };

  window.setTimeout(() => {
    handleSetError('');
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClick}
      />
      {error}
    </div>
  );
};
