import classNames from 'classnames';

type Props = {
  loadError: boolean,
  setLoadError: (value: boolean) => void,
  errorMessage: string,
};

export const ErrorWindow: React.FC<Props> = ({
  loadError,
  setLoadError,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !loadError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setLoadError(false)}
        aria-label="Close window"
      />

      {errorMessage}
    </div>
  );
};
