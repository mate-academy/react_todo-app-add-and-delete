import { addTodo, patchTodo, USER_ID } from '../../../api/todos';
import { ErrorType, Todo } from '../../../types';
import { useState } from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setProcessingId: React.Dispatch<React.SetStateAction<number | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setProcessingId,
  inputRef,
}) => {
  const tempId = 0;

  const [newTodo, setNewTodo] = useState<string>('');

  const hasIncompletedTodos = todos.some(todo => !todo.completed);
  const allCompleted = todos.length > 0 && !hasIncompletedTodos;

  const [isAdding, setIsAdding] = useState(false);

  const handleToggleAll = () => {
    todos.forEach(todo => {
      patchTodo(todo.id, { completed: !allCompleted })
        .then(updatedTodo => {
          setTodos(prev =>
            prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setError('update');
        });
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      {/* Add a todo on form submit */}
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();

          const title = newTodo.trim();

          setIsAdding(true);

          if (!title) {
            setError('emptyTitle');
            setIsAdding(false);

            return;
          }

          const tempTodo: Todo = {
            id: tempId,
            userId: USER_ID,
            title,
            completed: false,
          };

          setTodos(prev => [...prev, tempTodo]);

          setProcessingId(tempId);

          addTodo(title)
            .then(createdTodo => {
              setTodos(prev => [
                ...prev.filter(todo => todo.id !== tempId),
                createdTodo,
              ]);
              setNewTodo('');
            })
            .catch(() => {
              setError('add');

              setTodos(prev => prev.filter(todo => todo.id !== tempId));
            })
            .finally(() => {
              setIsAdding(false);
              setProcessingId(null);

              setTimeout(() => {
                inputRef.current?.focus();
              });
            });
        }}
      >
        <input
          ref={inputRef}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
