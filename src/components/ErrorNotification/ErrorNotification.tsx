/* eslint-disable jsx-a11y/control-has-associated-label */

import { Dispatch, SetStateAction } from 'react';

interface Props {
  getErrorStatus: boolean;
  setGetErrorStatus: (boolean: boolean) => void;
  emptyTitleError: boolean;
  setEmptyTitleError: Dispatch<SetStateAction<boolean>>;
  postErrorStatus: boolean;
  setPostErrorStatus: Dispatch<SetStateAction<boolean>>;
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const {
    getErrorStatus,
    setGetErrorStatus,
    emptyTitleError,
    setEmptyTitleError,
    postErrorStatus,
    setPostErrorStatus,
  } = props;

  return (
    <div
      hidden={!getErrorStatus && !emptyTitleError && !postErrorStatus}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setGetErrorStatus(false);
          setEmptyTitleError(false);
          setPostErrorStatus(false);
        }}
      />
      <span hidden={!getErrorStatus}>
        Unable to get a todo
      </span>
      <span hidden={!postErrorStatus}>
        Unable to add a todo
      </span>
      <span hidden>
        Unable to delete a todo
      </span>
      <span hidden>
        Unable to update a todo
      </span>
      <span hidden={!emptyTitleError}>
        {'Title can\'t be empty'}
      </span>
    </div>

  );
};
