import React, { useContext, useState } from 'react';
import { createTodo } from '../../api/todos';
import { TodosContext, USER_ID } from '../../TodoProvider';
import { Todo } from '../../types/Todo';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');

  const {
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useContext(TodosContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title can`t be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    createTodo(newTodo)
      .then(todo => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, todo]);
      }).catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-all"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          data-cy="createTodo"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
