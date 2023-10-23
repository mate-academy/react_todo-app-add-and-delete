import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  closeWindow?: () => void,
};

export const TodoErrorNotification: React.FC<Props> = ({
  errorMessage,
  closeWindow = () => { },
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage.length },
      )}
    >
      { /* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeWindow}
      />
      {errorMessage}
    </div>
  );
};
