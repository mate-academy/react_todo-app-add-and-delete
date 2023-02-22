import cn from 'classnames';
import React from 'react';
import { Errors } from '../../types/Errors';

interface Props {
  isHidden: boolean,
  message: Errors,
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;

}

export const ErrorNotification: React.FC<Props> = React.memo((
  {
    isHidden,
    message,
    setIsHidden,
  },
) => {
  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        type="button"
        aria-label="close_error_notification"
        className="delete"
        onClick={() => setIsHidden(false)}
      />
      {message}
    </div>
  );
});
