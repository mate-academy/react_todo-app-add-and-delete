import classNames from 'classnames';

interface Props {
  onClose: (value: string | null) => void,
  error: string | null,
}

export const Notification: React.FC<Props> = ({ onClose, error }) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => onClose(null)}
      />

      {error}
    </div>
  );
};
