/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  errorMessage: string;
  setClose: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoNotificaition: React.FC<Props> = ({
  errorMessage,
  setClose,
}) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setClose('')}
      />

      {errorMessage}
    </div>
  );
};
