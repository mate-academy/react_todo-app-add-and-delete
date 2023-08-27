import React, { useState } from 'react';
import classNames from 'classnames';

import { useTodo } from '../Hooks/UseTodo';
import { USER_ID } from '../variables/userId';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { createTodos, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setErrorVisibility: React.Dispatch<React.SetStateAction<boolean>>,
};

export const TodosHeader: React.FC<Props> = ({
  setTempTodo,
  setErrorVisibility,
}) => {
  const {
    todos,
    setTodos,
    setIsError,
    loading,
    setLoading,
  } = useTodo();

  const [inputTodo, setInputTodo] = useState('');

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputTodo.trim()) {
      setErrorVisibility(true);
      setIsError(ErrorMessage.EMPTY_TITLE);
      setTempTodo(null);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: inputTodo,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodos({
      userId: USER_ID,
      title: inputTodo,
      completed: false,
    })
      .then(() => {
        getTodos(USER_ID)
          .then((data) => {
            setTodos(data);
          })
          .catch(() => {
            setIsError(ErrorMessage.ADD);
            setErrorVisibility(true);
          })
          .finally(() => {
            setInputTodo('');
            setLoading(false);
            setTempTodo(null);
          });
      });
  };

  const handleInputTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTodo(event.target.value);
  };

  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {activeTodos.length > 0 && (
        <button
          type="button"
          aria-label="Toggle all todo"
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeTodos },
          )}
        />
      )}

      <form onSubmit={(event) => addTodo(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTodo}
          onChange={handleInputTodo}
          disabled={loading}
        />
      </form>
    </header>
  );
};
