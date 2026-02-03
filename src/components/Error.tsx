import classNames from 'classnames';

interface Props {
  errorMessage: string;
  onRemoveError: () => void;
}

export const Error: React.FC<Props> = ({ errorMessage, onRemoveError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onRemoveError}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
