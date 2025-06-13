interface ErrorMessageProps {
  errorMessage: string;
}
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />
    {errorMessage}
  </div>
);
