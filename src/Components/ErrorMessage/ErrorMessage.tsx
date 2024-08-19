import classNames from 'classnames';

type ErrorMessageProps = {
  errorMessageText: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessageText,
}) => {
  const messageClass = classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    {
      hidden: errorMessageText === '',
    },
  );

  return (
    <div data-cy="ErrorNotification" className={messageClass}>
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessageText}
      <br />
    </div>
  );
};
