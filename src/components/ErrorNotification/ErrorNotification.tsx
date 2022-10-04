import classNames from 'classnames';

type Props = {
  removeError: (boolean: boolean) => void
  error: boolean
  errorMessage: string | null
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  removeError,
  errorMessage,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !error,
          })}

      >
        <button
          aria-label="press button to delete"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => removeError(false)}
        />
        {errorMessage}
      </div>
    </>
  );
};
