import { useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';
import { Errors } from '../utils/Errors';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setError: React.Dispatch<React.SetStateAction<Errors>>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  setTodos, todos, setError, isLoading,
}) => {
  const hasTodos = true;
  const [newTodo, setNewTodo] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodo.trim();

    if (!trimmedTitle) {
      setError(Errors.EmptyTitle);

      return;
    }

    const newTodoItem: Todo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      userId: 9934,
      title: newTodo.trim(),
      completed: false,
    };

    try {
      const createdTodo = await createTodo(newTodoItem);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      throw new Error(`${Errors.Updating}: ${error}`);
    }

    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        /* eslint-disable jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className="todoapp__toggle-all"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
