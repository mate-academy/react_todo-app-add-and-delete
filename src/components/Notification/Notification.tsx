/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  isLoadingError: boolean;
  isAddTodoError: boolean;
  isTodoDeleteError: boolean;
  isTitleEmpty: boolean;
  removeNotification: () => void;
};

export const Notification: React.FC<Props> = ({
  isLoadingError,
  isAddTodoError,
  isTodoDeleteError,
  isTitleEmpty,
  removeNotification,
}) => {
  const isErrorPresent = isTitleEmpty || isLoadingError
  || isAddTodoError || isTodoDeleteError;

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isErrorPresent },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={removeNotification}
      />

      {isTitleEmpty && (<>Title can&apos;t be empty</>)}
      {isLoadingError && (<>Unable to load todos</>)}
      {isAddTodoError && (<>Unable to add a todo</>)}
      {isTodoDeleteError && (<>Unable to delete a todo</>)}
    </div>
  );
};
