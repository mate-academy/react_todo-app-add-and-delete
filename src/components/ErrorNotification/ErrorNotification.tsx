import React from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../enums/ErrorMessages';

type Props = {
  message: ErrorMessages
  showMessage: boolean
  closeNotification: (clearTimer?: boolean) => void
};
const ErrorNotification: React.FC<Props> = React.memo(({
  message,
  closeNotification,
  showMessage,
}) => {
  const closeHandler = () => {
    closeNotification(true);
  };

  return (
    <div
      className={
        cn(
          'notification  is-danger is-light has-text-weight-normal',
          { hidden: !showMessage },
        )
      }
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        onClick={closeHandler}
        type="button"
        className="delete"
      />

      {message}
    </div>
  );
});

export { ErrorNotification };
