import cl from 'classnames';

type Props = {
  errorMessage: string;
  onDelete: (value: string) => void;
};

export const TodoappErrorsBlock: React.FC<Props> = ({
  errorMessage,
  onDelete,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cl('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onDelete('')}
      />
      {errorMessage}
    </div>
  );
};
