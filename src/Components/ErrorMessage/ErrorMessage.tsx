import cn from 'classnames';
import { useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: Errors | null,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
};

export const ErrorMessage: React.FC<Props> = ({ error, setError }) => {
  const [hidden, setHidden] = useState(false);
  const handleClose = () => {
    setHidden(true);
    setError(null);
  };

  setTimeout(() => {
    setHidden(true);
    setError(null);
  }, 3000);

  if (!error) {
    return <></>;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn({
        notification: true,
        'is-danger': true,
        'is-light': true,
        'has-text-weight-normal': true,
        hidden,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {error}
    </div>
  );
};
