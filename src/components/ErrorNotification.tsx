import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  isErrorNoteShown: boolean;
  setErrorNoteShown: Dispatch<SetStateAction<boolean>>;
  error: string;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorNotification: React.FC<Props> = ({
  isErrorNoteShown,
  setErrorNoteShown,
  error,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!isErrorNoteShown}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorNoteShown(false)}
      />
      {error}
    </div>
  );
};
