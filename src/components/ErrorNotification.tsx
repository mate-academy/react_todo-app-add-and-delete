import cn from 'classnames';

export const ErrorNotification: React.FC<{ message: string }> = ({
  message,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      message === '' && 'hidden',
    )}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />

    {message.trim()}
  </div>
);
