import React, {
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { ToDo } from '../../types/ToDo';

type Props = {
  todos: ToDo[];
  title: string;
  tempTodo: ToDo | null;
  changeTitle: (title: string) => void;
  addTodo: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  title,
  tempTodo,
  changeTitle,
  addTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
        />
      )}
      {/* Add a todo on form submit */}
      <form action="/" method="POST" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(e) => changeTitle(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
