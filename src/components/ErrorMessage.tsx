import { ErrorType } from '../types/ErrorEnum';
import cn from 'classnames';

type Props = {
  errorToShow: ErrorType | null;
  onCloseBtn: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ errorToShow, onCloseBtn }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: errorToShow === null,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseBtn}
      />
      {/* show only one message at a time */}
      {errorToShow}
    </div>
  );
};
