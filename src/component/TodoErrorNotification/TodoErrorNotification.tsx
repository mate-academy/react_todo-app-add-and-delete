import React from 'react';
import cls from 'classnames';

export interface TodoErrorNotificationProps {
  getErrorMessage: () => string;
  isErrorHidden: () => boolean;
  hideErrors: () => void;
}

export const TodoErrorNotification: React.FC<TodoErrorNotificationProps> = ({
  getErrorMessage,
  isErrorHidden,
  hideErrors,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cls('notification is-danger is-light has-text-weight-normal', {
        hidden: isErrorHidden(),
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrors}
      />
      {/*/!* show only one message at a time *!/*/}
      {getErrorMessage()}
    </div>
  );
};
