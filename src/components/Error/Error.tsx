import React, { useEffect } from 'react';

type Props = {
  error: string,
  isHiddenClass: boolean,
  setIsHiddenClass: (val: boolean) => void,
};

export const Error: React
  .FC<Props> = ({
  error,
  isHiddenClass,
  setIsHiddenClass,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHiddenClass(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setIsHiddenClass, isHiddenClass]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isHiddenClass && 'hidden'}`}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setIsHiddenClass(true);
        }}
      />
      {error}
    </div>
  );
};
