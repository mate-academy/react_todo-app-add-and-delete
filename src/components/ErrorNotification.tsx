import classNames from 'classnames';

type Props = {
  errorMessage: string
  setErrorMessage: (val: string) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="CloseMessage"
        onClick={() => setErrorMessage('')}
      />
    </div>
  );
};
