/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect, useMemo, useRef } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  onErrorChange: (error: ErrorMessage) => void,
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, onErrorChange } = props;
  const timerRef = useRef<NodeJS.Timer>();
  const isHidden = useMemo(() => error === ErrorMessage.None, [error]);

  useEffect(() => {
    if (!isHidden) {
      timerRef.current = setTimeout(() => {
        onErrorChange(ErrorMessage.None);
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [error]);

  return (
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
        onClick={() => onErrorChange(ErrorMessage.None)}
      />
      {!isHidden && (
        error === ErrorMessage.NoTodos
          ? error
          : `Unable to ${error} a todo`
      )}
    </div>
  );
};
