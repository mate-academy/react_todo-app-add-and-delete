import React from 'react';

interface Props {
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  errorMesage: string;
}

export const ErrorMesage: React.FC<Props> = ({
  setErrorMesage,
  errorMesage,
}) => {
  function showErrorMesage() {
    setTimeout(() => setErrorMesage(''), 2000);

    return errorMesage;
  }

  return (
    <>
      {errorMesage !== '' ? (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMesage('')}
          />
          {showErrorMesage()}
        </div>
      ) : null}
    </>
  );
};
