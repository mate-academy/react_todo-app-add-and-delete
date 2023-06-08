import React from 'react';

interface Props {
  message: string,
  deleteErrorMessage: string,
  isThereIssue: boolean,
  editTodo: string,
  setIsThereIssue: (value: boolean) => void,
}

export const Error: React.FC<Props> = ({
  message,
  deleteErrorMessage,
  isThereIssue,
  editTodo,
  setIsThereIssue,
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
          {message}
          <br />
          {deleteErrorMessage}
          <br />
          {editTodo}
        </div>
      )}
    </>
  );
};
