import classNames from 'classnames';
import { FC } from 'react';

type Props = {
  isHidden: boolean,
  message: string,
  onClose: () => void
};

export const ErrorNotification: FC<Props> = (
  { isHidden, message, onClose },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: isHidden,
        })
      }
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
