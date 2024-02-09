/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
// import { getNextId } from '../utils/getNextId';
import { USER_ID } from '../constants';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const Header:React.FC = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const myInput = React.createRef<HTMLInputElement>();

  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useContext(TodoContext);

  useEffect(() => {
    myInput.current?.focus();
  }, [loading]);

  const uncompletedTodos = todos.filter(todo => !todo.completed).map(t => t.id);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = ((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      if (!title.trim()) {
        setErrorMessage('Title should not be empty');
        setLoading(false);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return;
      }

      setTempTodo({
        id: 0,
        title,
        completed: false,
      });

      const trimmedTitle = title.trim();

      const newTodo = {
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      createTodo(newTodo)
        .then(
          (createdTodo: Todo) => {
            setTodos((prev) => [...prev, createdTodo]);
            setTitle('');
          },
        )
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setLoading(false);
          setTimeout(() => {
            setErrorMessage('');
        }, 3000);
      });
    });

  const handleUncompletedTodos = (ids: number[]) => {
    const updatedTodos = todos.map(todo => {
      if (ids.includes(todo.id)) {
        return {
          ...todo,
          completed: true,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => handleUncompletedTodos(uncompletedTodos)}
      />

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          ref={myInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};
