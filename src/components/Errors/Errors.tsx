import { useEffect, useRef } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  error: string,
  onSetError: (error: string) => void,
};

export const Errors: React.FC<Props> = ({ error, onSetError }) => {
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (error.length !== 0) {
      timerRef.current = setTimeout(() => {
        onSetError('');
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={error.length === 0}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetError('')}
      />
      {error}
    </div>
  );
};
