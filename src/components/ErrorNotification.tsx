import classNames from 'classnames';

type Props = {
  showError: boolean,
  error: string,
  onErrorClose: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  showError,
  error,
  onErrorClose
}) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !showError },
    )}
  >
    <button
      type="button"
      className="delete"
      onClick={onErrorClose}
    />
    {error}
  </div>
)