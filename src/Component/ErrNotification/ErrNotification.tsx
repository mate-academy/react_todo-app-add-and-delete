import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMessage: ErrorType | null;
  isHidden: boolean;
  onCloseError: (value: ErrorType | null) => void;
};

export const ErrNotification: React.FC<Props> = ({
  errorMessage, isHidden, onCloseError,
}) => {
  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: isHidden,
      })}
    >
      <button
        aria-label="delete notification"
        type="button"
        className="delete"
        onClick={() => onCloseError(null)}
      />
      {errorMessage}
    </div>
  );
};
