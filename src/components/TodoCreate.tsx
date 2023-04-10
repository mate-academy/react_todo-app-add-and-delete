import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Response } from '../types/Response';

export const TodoCreate: React.FC<{
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[] | undefined>>;
  setTemporaryTodos: React.Dispatch<React.SetStateAction<Todo[] | undefined>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  countNotComplited: boolean | undefined;
  clearCompleted: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setTodosFromServer,
  setTemporaryTodos,
  setErrorMessage,
  countNotComplited,
  clearCompleted,
  isLoading,
  setIsLoading,
}) => {
  const [inputPlace, setInputPlace] = useState('');

  const handleNewTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const temporaryTodo = {
        title: inputPlace,
        userId: 6757,
        completed: false,
      };

      const util = () => {
        setIsLoading(true);
        setTemporaryTodos([{ ...temporaryTodo, id: Date.now() },
        ]);
        client.post('/todos', temporaryTodo)
          .then((response) => {
            const {
              id, title, completed, userId,
            } = response as Response;

            setTodosFromServer((prevState = []) => [...prevState, {
              id,
              title,
              completed,
              userId,
            }]);

            setTemporaryTodos([]);
            setInputPlace('');
            setIsLoading(false);
          })
          .catch(() => {
            setInputPlace('');
            setErrorMessage('Unable to add a todo');
            setIsLoading(false);
          });
      };

      if (inputPlace.trim().length) {
        util();
      } else {
        setErrorMessage("Title can't be empty");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPlace(event.currentTarget.value);
  };

  return (
    <>
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !countNotComplited },
        )}
        onClick={clearCompleted}
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
          onChange={handleChange}
          onKeyDown={handleNewTodo}
        />
      </form>
    </>
  );
};
