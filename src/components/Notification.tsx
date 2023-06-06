interface ErrorProps {
  message: string,
  handleErrorReset: () => void,
}

export const Notification: React.FC<ErrorProps> = ({
  message,
  handleErrorReset,
}) => {
  return (
    <div className={`notification is-danger is-light has-text-weight-normal ${!message && 'hidden'}`}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleErrorReset}
      />
      {message}
    </div>
  );
};
