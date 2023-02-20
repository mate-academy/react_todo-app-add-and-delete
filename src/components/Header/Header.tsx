import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  onFormSubmit: () => void,
  title: string,
  todos: Todo[];
  onTitleChange: (newTitle: string) => void,
};

export const Header: React.FC<Props> = ({
  onFormSubmit,
  title,
  todos,
  onTitleChange,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        aria-label="remove active button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !(activeTodos.length > 0) },
        )}
      />

      {/* Add a todo on form submit */}
      <AddTodoForm
        onFormSubmit={onFormSubmit}
        title={title}
        onTitleChange={onTitleChange}
      />
    </header>
  );
};
