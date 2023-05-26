import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { addTodo } from '../api/todos';
import { TodoError } from '../types/Error';
import { USER_ID } from '../utils/constants';

export const TodoForm: React.FC = () => {
  const {
    setTodos,
    setError,
  } = useTodoContext();

  const [todoTitle, setTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      setError(TodoError.INVALID_INPUT);

      return;
    }

    setError(null);
    setIsCreating(true);

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    try {
      const todo = await addTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, todo]);
    } catch {
      setError(TodoError.UNABLE_ADD);
    } finally {
      setIsCreating(false);
    }

    setTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
        disabled={isCreating}
      />
    </form>
  );
};
