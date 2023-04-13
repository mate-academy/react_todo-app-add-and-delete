import classNames from 'classnames';

type Props = {
  text: string;
  onClose?: () => void;
  showError: boolean;
};

export const ErrorMessage: React.FC<Props> = (props) => {
  const { text, onClose, showError } = props;

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !showError },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      {text}
    </div>
  );
};
