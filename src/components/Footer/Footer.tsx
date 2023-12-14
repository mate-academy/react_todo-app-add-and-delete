import React from 'react';
import { Filter } from '../TodosFilter';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[],
  todosStatus: Status,
  setTodosStatus: (s: Status) => void,
  activeTodos: Todo[],
  removeTodo: (id: number[]) => void
};

export const Footer: React.FC<Props> = ({
  todosStatus,
  setTodosStatus,
  todos,
  activeTodos,
  removeTodo,
}) => {
  const completedTodo = todos.filter(todo => todo.completed)
    .map(item => item.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>
      <Filter setTodosStatus={setTodosStatus} todosStatus={todosStatus} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodo.length === 0}
        onClick={() => removeTodo(completedTodo)}
      >
        Clear completed
      </button>
    </footer>
  );
};
