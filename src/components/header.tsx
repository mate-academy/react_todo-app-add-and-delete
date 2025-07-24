import React from 'react';
import { Todo } from '../types/Todo';
import { getTodos, patchTodo } from '../api/todos';

interface Props {
  title: string;
  setTitle: (title: string) => void;
  addNewTodoFromInput: (e: React.FormEvent<HTMLFormElement>) => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  isInputDisabled: boolean;
}

export const Header: React.FC<Props> = ({
  addNewTodoFromInput,
  title,
  setTitle,
  todos,
  setTodos,
  setIsLoading,
  setLoadingTodoIds,
  isInputDisabled,
}) => {
  const handleToggleAll = () => {
    const ggBet = todos.every(todo => todo.completed);
    const newStatus = !ggBet;

    const ids = todos.map(todo => todo.id);

    setLoadingTodoIds(ids);

    setIsLoading(true);
    Promise.all(todos.map(todo => patchTodo(todo.id, newStatus)))
      .then(() => {
        getTodos().then(setTodos);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoIds([]);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll()}
        />
      )}

      <form
        onSubmit={e => {
          addNewTodoFromInput(e);
          setTimeout(() => {
            setTitle('');
          }, 500);
        }}
      >
        <input
          disabled={isInputDisabled}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
