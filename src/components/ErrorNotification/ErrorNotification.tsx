import classnames from 'classnames';

type Props = {
  error: boolean;
  handleErrorChange: (bool: boolean) => void;
  errorText: string;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  handleErrorChange,
  errorText,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleErrorChange(false)}
      />

      {errorText}
    </div>
  );
};
