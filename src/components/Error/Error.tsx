/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

type Props = {
  hasError: string,
  setHasError: (string: string) => void,
};

export const Error: FC<Props> = ({ hasError, setHasError }) => {
  return (
    <>
      {hasError && (
        <div className="
          notification is-danger
          is-light has-text-weight-normal
          "
        >
          <button
            type="button"
            className="delete"
            onClick={() => setHasError('')}
          />
          {hasError}
        </div>
      )}
      ;
    </>
  );
};
