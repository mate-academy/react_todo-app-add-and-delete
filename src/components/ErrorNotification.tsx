import classNames from 'classnames';
type Props = {
  errorType: string | null;
  setErrorType: (errorType: string | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorType,
  errorType,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorType === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorType(null);
        }}
      />
      {/* show only one message at a time */}

      {errorType}
    </div>
  );
};
