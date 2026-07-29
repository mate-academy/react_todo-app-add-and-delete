import cn from 'classnames';

type Props = { message: string; onCloseError: () => void };

export const ErrorMessage = ({ message, onCloseError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger is-light',
        'has-text-weight-normal',
        !message && 'hidden',
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
