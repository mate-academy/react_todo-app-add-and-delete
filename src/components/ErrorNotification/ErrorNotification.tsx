/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  isAlertVisible: boolean,
  alertText: string,
  handleClearAlert: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  isAlertVisible,
  alertText,
  handleClearAlert,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!isAlertVisible}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleClearAlert()}
      />
      {alertText}
    </div>
  );
};
