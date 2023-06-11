import { useContext } from 'react';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../App';

interface Props {
  error: string | null;
}

export const TodoError: React.FC<Props> = ({ error }) => {
  const setError = useContext(SetErrorContext);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={() => setError?.(ErrorMessage.NoError)}
        // #TODO: get rid of the nasty ?. somehow

      />
      {error}
    </div>
  );
};
