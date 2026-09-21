type Props = {
  error: string;
  onClose: () => void;
};

export const ErrorNotification = ({ error, onClose }: Props) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${
      error ? '' : 'hidden'
    }`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />

    {error}
  </div>
);
