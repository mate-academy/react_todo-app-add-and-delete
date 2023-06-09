import { useEffect, useState } from 'react';

interface Props {
  error: string | null;
  setError: (arg0: string | null) => void,
}

export const TodoError: React.FC<Props> = ({ error, setError }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      default:
    }
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={() => setError(null)}
      />
      {errorMessage}
    </div>
  );
};
