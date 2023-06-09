import { useContext, useEffect, useState } from 'react';
import { SetErrorContext } from '../utils/setErrorContext';

interface Props {
  error: string | null;
}

export const TodoError: React.FC<Props> = ({ error }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setError = useContext(SetErrorContext);

  useEffect(() => {
    switch (error) {
      case 'cantfetch':
        setErrorMessage('Unable to fetch todos');
        break;
      case 'cantadd':
        setErrorMessage('Unable to add a todo');
        break;
      case 'cantdelete':
        setErrorMessage('Unable to delete a todo');
        break;
      case 'cantupdate':
        setErrorMessage('Unable to update a todo');
        break;
      case 'emptytitle':
        setErrorMessage('Title can\'t be empty');
        break;
      default:
    }
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={() => setError?.(null)}
        // #TODO: get rid of the nasty ?. somehow

      />
      {errorMessage}
    </div>
  );
};
