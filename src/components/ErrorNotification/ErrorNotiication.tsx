/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

interface Props {
  error: ErrorTypes,
  isHidden: boolean,
  onHiddenChange: (isError: boolean) => void,
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  isHidden,
  onHiddenChange,
}) => {
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!isHidden) {
      timerRef.current = setTimeout(() => {
        onHiddenChange(true);
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [isHidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onHiddenChange(true);
        }}
      />
      {error}
    </div>
  );
};
