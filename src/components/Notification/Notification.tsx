import React, { useEffect, useState } from 'react';
import { wait } from '../../utils/fetchClient';
import { Error } from '../../types/Error';

type Props = {
  errors: Error[];
  setErrors: (cb: (prev: Error[]) => Error[]) => void;
};

export const Notification: React.FC<Props> = ({ errors, setErrors }) => {
  const [isHidden, setIsHidden] = useState(false);
  const { title, isDanger } = errors[0];

  const closeError = () => {
    setIsHidden(true);
    wait(900).then(() => {
      setErrors(prev => prev.slice(1));
      setIsHidden(false);
    });
  };

  useEffect(() => {
    const intervalId = setInterval(closeError, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={`notification${isDanger ? ' is-danger' : ' is-light'} has-text-weight-normal${isHidden ? ' hidden' : ''}`}>
      <button
        type="button"
        className="delete"
        onClick={closeError}
        aria-label="Close all"
      />
      {title}
    </div>
  );
};
