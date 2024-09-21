import React, { useMemo } from 'react';
import { NewTodoForm } from '../NewTodoForm/NewTodoForm';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onAddTodo: (todo: Todo) => Promise<void>;
  onUpdateTodosCompleted: (todo: Todo) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todos,
  onAddTodo,
  onUpdateTodosCompleted,
}) => {
  const isEveryTodoCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const todosCount = useMemo(() => {
    return todos.length;
  }, [todos]);

  const handleUpdateTodoComplete = () => {
    if (isEveryTodoCompleted) {
      todos.forEach(todo =>
        onUpdateTodosCompleted({ ...todo, completed: false }),
      );
    } else {
      todos.forEach(todo =>
        onUpdateTodosCompleted({ ...todo, completed: true }),
      );
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryTodoCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleUpdateTodoComplete}
      />

      <NewTodoForm onSubmit={onAddTodo} todosCount={todosCount} />
    </header>
  );
};
