import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

type Props = {
  todos: Todo[],
  onRemove: (todoId: number) => void,
};

export const TodoFooter: React.FC<Props> = React.memo(
  ({ todos, onRemove }) => {
    const todosLeft = useMemo(() => (
      todos.filter(todo => !todo.completed).length
    ), [todos]);

    const completedTodos = useMemo(() => (
      todos.filter(todo => todo.completed)
    ), [todos]);

    const handleClick = () => completedTodos.forEach(todo => onRemove(todo.id));

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${todosLeft} items left`}
        </span>

        <Filter />

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={todos.length === todosLeft}
          onClick={handleClick}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
