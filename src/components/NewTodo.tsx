import { FormEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';
import { addOnServer, getTodos, updateOnServer } from '../api/todos';

type Props = {
  userId: number;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (value: ErrorType) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  setUpdatingTodos: (value: number[]) => void;
};

export const NewTodo: React.FC<Props> = ({
  userId,
  todos,
  setTodos,
  setError,
  setIsLoading,
  isLoading,
  setUpdatingTodos,

}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTodoTitle.trim().length) {
      setError(ErrorType.Empty);

      return;
    }

    const createdTodo = {
      title: newTodoTitle,
      userId,
      completed: false,
    };

    const tempTodo = {
      ...createdTodo,
      id: 0,
    };

    setIsLoading(true);
    setTodos([...todos, tempTodo]);

    addOnServer(createdTodo)
      .then(() => getTodos(userId))
      .then((updatedTodoList) => {
        setTodos(updatedTodoList);
        setNewTodoTitle('');
        setIsLoading(false);
      })
      .catch(() => {
        setError(ErrorType.Add);
        setIsLoading(false);
      });
  }

  const visibleTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed);

  function handleTodosStatus(status: boolean) {
    let updatedTodos = [...todos];
    const updatedTodoIds = updatedTodos.map(todo => todo.id);

    setUpdatingTodos(updatedTodoIds);

    updatedTodos = updatedTodos.map((todo) => ({ ...todo, completed: status }));

    updatedTodos.forEach(todo => updateOnServer(todo)
      .catch(() => setError(ErrorType.Update))
      .finally(() => setUpdatingTodos([])));

    setTodos(updatedTodos);
  }

  return (
    <header className="todoapp__header">
      {visibleTodos > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodos,
          })}
          onClick={() => (completedTodos.length === todos.length
            ? handleTodosStatus(false)
            : handleTodosStatus(true))}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
