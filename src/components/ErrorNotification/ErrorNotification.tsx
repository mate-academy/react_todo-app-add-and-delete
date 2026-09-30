import cn from 'classnames';

type ErrorNotificationProps = {
  errorText: string;
  setErrorText: (text: string) => void;
};

export const ErrorNotification = ({
  errorText,
  setErrorText,
}: ErrorNotificationProps) => {
  // {/* DON'T use conditional rendering to hide the notification */}
  // {/* Add the 'hidden' class to hide the message smoothly */}
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorText,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      />
      {errorText}
    </div>
  );
};
