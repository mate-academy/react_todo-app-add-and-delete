import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import { USER_ID } from '../../constans';
import { getTodos } from '../../services/todos';
import { Todo } from '../../types/Todo';

interface Props {
  addTodo: (post: Todo) => Promise<void>;
  newError: (error: string) => void;
  onTempTodo: (todo: Todo) => void;
  loading: boolean;
  onLoading: (value: boolean) => void;
  todos: Todo[];
}

export const TodoForm: React.FC<Props> = React.memo(function TodoFormComponent({
  addTodo,
  newError,
  onTempTodo,
  loading,
  onLoading,
  todos,
}) {
  const [title, setTitle] = useState('');

  const newTodoFieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!newTodoFieldFocus.current) {
      newTodoFieldFocus.current.focus();
    }
  }, [loading]);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onLoading(true);

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      newError('Title should not be empty');
      onLoading(false);

      return;
    }

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title: normalizeTitle,
    };

    onTempTodo(todo);

    addTodo(todo)
      .then(reset)
      .finally(() => onLoading(false));
  };

  const IsEveryCompletedTodos = useMemo(
    () => getTodos.isEveryCompleted(todos),
    [todos],
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: IsEveryCompletedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldFocus}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
