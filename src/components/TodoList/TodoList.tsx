import React from 'react';

import { Todo } from '../../types/Todo';
import { Filter } from '../../types/FilterEnum';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  filter: Filter;
  onDelete: (todoId: number) => void;
  onToggleTodo: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => void;
  loadingTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  onDelete,
  onToggleTodo,
  loadingTodoIds,
}) => {
  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggleTodo={onToggleTodo}
          loadingTodoIds={loadingTodoIds}
        />
      ))}
    </section>
  );
};
