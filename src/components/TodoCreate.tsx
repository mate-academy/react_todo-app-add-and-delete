import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const TodoCreate: React.FC<{
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  clearCompleted: (status: string) => void
  askTodos: (url: string) => void
  statusComplited: {
    countComplited: boolean;
    countNotComplited: boolean;
    todosFromServer: Todo[] | undefined;
  }
}> = ({
  setErrorMessage,
  clearCompleted,
  askTodos,
  statusComplited,
}) => {
  const [inputPlace, setInputPlace] = useState('');
  const [isLoading, setIsLoading] = useState(!statusComplited.todosFromServer);
  const handleNewTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsLoading(true);
      if (inputPlace !== '') {
        client.post('/todos',
          {
            title: inputPlace,
            userId: 6757,
            completed: false,
          })
          .then(() => {
            askTodos('/todos?userId=6757');
            setInputPlace('');
          })
          .catch(() => setErrorMessage('Unable to add a todo'));
      }
    }
  };

  useEffect(() => {
    setIsLoading(!statusComplited.todosFromServer);
  }, [statusComplited.todosFromServer]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPlace(event.currentTarget.value.trimStart());
  };

  return (
    <>
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !statusComplited.countNotComplited },
        )}
        onClick={() => clearCompleted('invert')}
      >
        {}

      </button>

      <form>
        <input
          type="text"
          value={inputPlace}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          onKeyDown={handleNewTodo}
          onChange={handleChange}
        />
      </form>
    </>
  );
};
