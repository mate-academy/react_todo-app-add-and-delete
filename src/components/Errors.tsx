import { Dispatch, SetStateAction } from 'react';

interface Props {
  errorId: number,
  setErrorId: Dispatch<SetStateAction<number>>
}

export const Errors: React.FC<Props> = ({
  errorId,
  setErrorId,
}) => {
  const handleCloseErrors = () => {
    setErrorId(0);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide error button"
        className={`delete ${errorId === 0 && 'hidden'}`}
        onClick={handleCloseErrors}
      />

      {/* show only one message at a time */}
      {errorId === 1 && (
        <p>Unable to load todos</p>
      )}
      {errorId === 2 && (
        <p>Unable to add todo</p>
      )}
      {errorId === 3 && (
        <p>Unable to delete todo</p>
      )}
      {errorId === 4 && (
        <p>Title shouldnt be empty</p>
      )}
      <br />
    </div>
  );
};
