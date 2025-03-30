import cn from 'classnames';
import { ErrorEnum } from '../../types/ErrorEnum';
import { useEffect } from 'react';

type Props = {
  error: ErrorEnum | null;
  onClose: () => void;
};

export const Error: React.FC<Props> = ({ error, onClose }) => {
  useEffect(() => {
    setTimeout(onClose, 3000);
  }, [error, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
