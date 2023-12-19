import cn from 'classnames';
import { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorEnum';

interface Props {
  errMessage: ErrorType,
  onClose: () => void;
}

export const ErrorBlock: React.FC<Props> = ({ errMessage, onClose }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  }, [onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errMessage },
      )}
    >
      <button
        aria-labelledby="buttn-label"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errMessage}
    </div>
  );
};
