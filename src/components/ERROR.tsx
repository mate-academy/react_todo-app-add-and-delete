/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

interface Props {
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Eror: FC<Props> = ({ setErrorMessage, errorMessage }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {`Unable to create a todos, because ${errorMessage}`}
    </div>
  );
};
