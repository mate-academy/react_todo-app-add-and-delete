import { ErrorType } from '../../types/error';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  errorMessage: ErrorType
  closeNotification: () => void
};

export const TodoError: React.FC<Props> = ({
  errorMessage,
  closeNotification,
}) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" onClick={closeNotification} />

      {errorMessage}
    </div>
  );
};

export default TodoError;
