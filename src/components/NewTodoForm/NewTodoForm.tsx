import React, { useContext, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Error } from '../../types';
import { AppContext } from '../AppProvider/AppProvider';
import { AuthContext } from '../Auth/AuthContext';

export const NewTodoForm = () => {
  const [title, setTitle] = useState('');

  const {
    setError,
    todos,
    setTodos,
    setTempTodo,
  } = useContext(AppContext);

  const user = useContext(AuthContext);

  const todoId = todos.length
    ? Math.max(...todos.map(({ id }) => id + 1))
    : Number(Date.now().toString().slice(-4));

  const todo = {
    title,
    userId: user?.id || 0,
    completed: false,
    id: todoId,
  };

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title) {
      try {
        setTempTodo({ ...todo, id: 0 });
        await postTodo(todo);
        setTodos([...todos, todo]);
      } catch {
        setError(Error.Add);
      } finally {
        setTitle('');
        setTempTodo(null);
      }
    } else {
      setError(Error.Title);
    }
  };

  return (
    <form onSubmit={addTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
