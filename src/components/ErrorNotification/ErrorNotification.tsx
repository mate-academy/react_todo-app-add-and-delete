/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  query: string;
  onErrorChange: (value: boolean) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  query,
  onErrorChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorChange(false)}
      />

      {!query && (
        'Title can\'t be empty'
      )}
      <br />
    </div>
  );
};
