import cn from 'classnames';

type Props = {
  errorMessage: string;
};

export const NotificationHandler: React.FC<Props> = ({ errorMessage }) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="error-notifier"
    />
    {errorMessage}
  </div>
);
