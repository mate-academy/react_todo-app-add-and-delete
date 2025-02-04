import classNames from 'classnames';

type Props = {
  message: string;
  clearMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  message,
  clearMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          clearMessage('');
        }}
      />
      {message}
    </div>
  );
};
