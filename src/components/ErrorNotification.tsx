import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  error: string | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {

  useEffect(() => {
    setTimeout(() => onClose(''), 3000);
  });


  return (
    <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error }
    )}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" onClick={onClose}/>
    {error}
  </div>
  )
};
