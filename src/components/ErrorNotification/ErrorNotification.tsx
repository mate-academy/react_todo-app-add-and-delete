import classNames from 'classnames';
import React, { useEffect, useMemo, useRef } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  onErrorMessageChange: (error: ErrorMessage) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onErrorMessageChange,
}) => {
  const timerRef = useRef<NodeJS.Timer>();
  const isHidden = useMemo(() => error === ErrorMessage.None, [error]);

  useEffect(() => {
    if (!isHidden) {
      timerRef.current = setTimeout(() => {
        onErrorMessageChange(ErrorMessage.None);
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [error]);

  return (
    /* eslint-disable jsx-a11y/control-has-associated-label */
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessageChange(ErrorMessage.None)}
      />
      {!isHidden && (
        error === ErrorMessage.NoTodos
          ? error
          : `Unable to ${error} a todo`
      )}
    </div>
  );
};
