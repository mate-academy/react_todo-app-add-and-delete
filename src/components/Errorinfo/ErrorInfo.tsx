import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  errorMsg: ErrorType | null;
  setErrorMsg: (error: ErrorType | null) => void;
}

export const ErrorInfo = ({ errorMsg, setErrorMsg }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMsg,
      })}
    >
      <button
        aria-label="Hide Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMsg(null)}
      />
      {errorMsg}
    </div>
  );
};
