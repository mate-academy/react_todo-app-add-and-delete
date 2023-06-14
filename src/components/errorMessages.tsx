import React from 'react';

interface Props {
  loadError: string,
  deleteErrorMessage: string,
  isThereIssue: boolean,
  setIsThereIssue: (value: boolean) => void,
  isTitleEmpty: string,
}

export const ErrorMessage: React.FC<Props> = ({
  loadError,
  deleteErrorMessage,
  isThereIssue,
  setIsThereIssue,
  isTitleEmpty,
}) => {
  return (
    <>
      {isThereIssue && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            type="button"
            className="delete"
            onClick={() => setIsThereIssue(false)}
          >
            {null}
          </button>
          <br />
          {isTitleEmpty}
          <br />
          {loadError}
          <br />
          {deleteErrorMessage}
        </div>
      )}
    </>
  );
};
