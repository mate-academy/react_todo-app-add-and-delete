import classNames from 'classnames';

type Props = {
  errorMesssage: string,
  setErrorMesssage: (val: string) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMesssage,
  setErrorMesssage,
}) => {
  const removeErrorMessage = () => setErrorMesssage('');

  if (errorMesssage) {
    setTimeout(removeErrorMessage, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMesssage },
      )}
    >
      <button
        aria-label="error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMesssage('')}
      />
      {errorMesssage}
    </div>
  );
};
