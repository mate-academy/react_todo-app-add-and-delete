import classNames from 'classnames';

type Props = {
  error: string;
  onDismiss: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onDismiss }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onDismiss}
      />
      {error}
    </div>
  );
};
