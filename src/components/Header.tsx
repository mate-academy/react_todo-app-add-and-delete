import { MutableRefObject } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useCallback } from 'react';

type Props = {
  todos: Todo[];
  filteredTodos: Todo[];
  enteredTodo: string;
  checkAllTodos: (todosAll: Todo[]) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
};

export const Header: React.FC<Props> = ({
  todos,
  filteredTodos,
  enteredTodo,
  checkAllTodos,
  handleSubmit,
  handleTitleChange,
  inputRef,
}) => {
  const isCompleted = useCallback((todo: Todo) => {
    return todo.completed;
  }, []);

  let todosAllCompleted;

  if (filteredTodos.length > 0) {
    todosAllCompleted = filteredTodos.every(isCompleted);
  } else {
    todosAllCompleted = false;
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => checkAllTodos(filteredTodos)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={enteredTodo}
          onChange={handleTitleChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
