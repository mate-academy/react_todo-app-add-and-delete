import classNames from 'classnames';

type Props = {
  error: boolean,
  SetError: (value: boolean) => void,
  subtitleError: string,
};
export const Notification: React.FC<Props> = ({
  error,
  SetError,
  subtitleError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="error"
        onClick={() => SetError(true)}
      />
      {subtitleError}
    </div>
  );
};
