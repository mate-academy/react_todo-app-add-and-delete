/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { TodoErrors } from '../../types/ErrorMessages';

interface Props {
  handleSkipErrorClick: React.Dispatch<React.SetStateAction<TodoErrors>>,
  message: string,
}

export const ErrorNotification: FC<Props> = ({
  handleSkipErrorClick,
  message,
}) => {
  useEffect(() => {
    setTimeout(() => {
      handleSkipErrorClick(TodoErrors.none);
    }, 3000);
  }, [message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleSkipErrorClick(TodoErrors.none)}
      />
      <span>{message}</span>
    </div>

  );
};
