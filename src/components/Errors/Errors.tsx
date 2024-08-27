import classNames from 'classnames';

type Props = {
  hasError: boolean;
  errorMessage: string;
};
export const Error: React.FC<Props> = ({ hasError, errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
