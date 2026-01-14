type Props = {
  errorMessage: string | null;
};

export const ErrorMessage = ({ errorMessage }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        !errorMessage
          ? 'notification is-danger is-light has-text-weight-normal hidden'
          : 'notification is-danger is-light has-text-weight-normal'
      }
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorMessage}
      {/* <br />
        Unable to update a todo */}
    </div>
  );
};

export default ErrorMessage;
