import cn from 'classnames';

interface Props {
  errorMessage: string;
}

export const ErrorNotification = ({ errorMessage }: Props) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />
    {errorMessage}
  </div>
);

export default ErrorNotification;
