/*eslint-disable*/
import React from 'react';

import cn from 'classnames';

type Props = {
  onErrorMessage: (value: string) => void,
  errorMessage: string,
};

export const TodoError: React.FC<Props> = ({
  onErrorMessage,
  errorMessage,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={
          cn('notification is-danger is-light has-text-weight-normal', {
            'hidden': !errorMessage,
          })
        }
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onErrorMessage('')}
        />
        {errorMessage}
      </div>
    </>
  );
};
