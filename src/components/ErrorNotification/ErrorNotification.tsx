import cn from 'classnames';

type ErrorNotificationProps = {
  errorMsg: string;
  onHideError: () => void;
};

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMsg,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMsg,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {errorMsg}
    </div>
  );
};

export default ErrorNotification;
