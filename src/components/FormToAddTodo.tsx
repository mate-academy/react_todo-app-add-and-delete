import React, { FormEvent, useContext, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { addTodo } from '../api/todos';
import { USER_ID } from '../constants/USER_ID';

export const FormToAddTodo: React.FC = () => {
  const [title, setTitle] = useState('');

  const {
    todos,
    setTodos,
    setError,
    setTempTodo,
  } = useContext(TodoContext);

  const handleCreateTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title cannot be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then((createdTodo) => {
        setTodos([...todos, createdTodo]);
        setTitle('');
      })
      .catch(() => setError('Unable to add todo'))
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <form onSubmit={handleCreateTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        value={title}
        placeholder="What needs to be done?"
        onChange={(event) => setTitle(event.target.value)}
      />
    </form>
  );
};
