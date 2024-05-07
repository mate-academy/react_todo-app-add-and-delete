import { useContext } from 'react';
import { TodoContext } from './TodoContext';
import cn from 'classnames';

export const Error: React.FC = () => {
  const { error, setError } = useContext(TodoContext);
  // const [newError, setNewError] = useState('');

  // useEffect(() => {
  //   if (errorMessage !== '') {
  //     setNewError(error);
  //   }
  // }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
      {/* show only one message at a time */}
      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
