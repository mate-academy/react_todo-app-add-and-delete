/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  errorMessage: string;
  onCloseError: (e: string) => void;
};
export const Error: React.FC<Props> = ({
  errorMessage,
  onCloseError,
}) => (
  <div
    data-cy="ErrorNotification"
    className="notification is-danger is-light has-text-weight-normal"
    hidden={!(errorMessage.length > 0)}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => onCloseError('')}
    />
    {errorMessage}
    <br />
  </div>
);
