import { Errors } from '../../types/Errors';

type Props = {
  isAlertVisible: boolean,
  alertText: Errors | null,
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
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleClearAlert()}
      />
      {alertText}
    </div>
  );
};
