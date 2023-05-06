import classNames from 'classnames';

type Props = {
  error: boolean;
  deleteError: (value: boolean) => void;
  errorMessage: string;
};

export const Notification: React.FC<Props> = ({
  error,
  deleteError,
  errorMessage,
}) => {
  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => deleteError(false)}
        aria-label="delete"
      />
      {errorMessage}
    </div>
  );
};
