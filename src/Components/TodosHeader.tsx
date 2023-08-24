import React, { useState } from 'react';
import { useTodo } from '../Hooks/UseTodo';
import { USER_ID } from '../variables/userId';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { createTodos } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

export const TodosHeader: React.FC<Props> = ({ setTempTodo }) => {
  const {
    todo,
    setTodo,
    setIsError,
    setloading,
    loading,
  } = useTodo();

  const [inputTodo, setInputTodo] = useState('');

  const handleInputTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputTodo.trim()) {
      setIsError(ErrorMessage.EMPTY_TITLE);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: inputTodo,
      completed: false,
    };

    setTempTodo(newTodo);

    if (inputTodo.trim()) {
      createTodos({
        userId: USER_ID,
        title: inputTodo,
        completed: false,
      })
        .then(newTodos => {
          setTodo([...todo, newTodos]);
          setloading(false);
          setInputTodo('');
        })
        .catch(() => setIsError(ErrorMessage.ADD))
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const addTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTodo(event.target.value);
  };

  const activeTodos = todo.filter(todos => !todos.completed).length;

  return (
    <header className="todoapp__header">
      {activeTodos > 0 && (
        <button
          type="button"
          aria-label="Toggle all todo"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleInputTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTodo}
          onChange={addTodo}
          disabled={loading}
        />
      </form>
    </header>
  );
};
