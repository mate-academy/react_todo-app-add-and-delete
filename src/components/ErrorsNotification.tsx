import { useEffect } from 'react';

type Props = {
  errorMesage: string;
  handleErrorMessages: (newErrorMessage?: string, hidden?: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMesage,
  handleErrorMessages,
}) => {
  useEffect(() => {
    const id = window.setTimeout(() => {
      handleErrorMessages('');
    }, 3000);

    return () => {
      window.clearTimeout(id);
    };
  }, [errorMesage, handleErrorMessages]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMesage.length === 0 ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete hidden"
        onClick={() => handleErrorMessages('')}
      />
      {errorMesage}
      {/* Title should not be empty
      Unable to add a todo
      Unable to delete a todo
      Unable to update a todo */}
    </div>
  );
};
