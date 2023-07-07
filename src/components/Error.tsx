/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';

interface ErrorProps {
  error:string,
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <>
      {error
      && (
        <div className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}>
          <button
            type="button"
            className="delete"
            onClick={() => setIsHidden(true)}
          />
          {error}
        </div>
      )}
    </>
  );
};
