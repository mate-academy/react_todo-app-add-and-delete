import classNames from 'classnames';

type Props = {
  errorMessage: string;
  isNotificationHidden: boolean;
  onClose: (value: boolean) => void;
};

export const CustomNotification: React.FC<Props> = ({
  errorMessage,
  isNotificationHidden,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isNotificationHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose(true)}
      />
      {errorMessage}
    </div>
  );
};

// Unable to load todos
// <br />
// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
