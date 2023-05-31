interface Props {
  message: string,
  handleClose: () => void,
}

export const Notification: React.FC<Props> = ({ message, handleClose }) => {
  return (
    <div className={`notification is-danger is-light has-text-weight-normal ${!message && 'hidden'}`}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {message}
    </div>
  );
};
