import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button
      onClick={() => setErrorMessage('')}
      data-cy="HideErrorButton"
      type="button"
      className="delete"
    />
    {errorMessage}
    {/* 
       
        Unable to update a todo * */}
  </div>
);
