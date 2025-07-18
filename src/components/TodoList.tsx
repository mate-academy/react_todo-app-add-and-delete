import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import '../styles/index.scss';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  globalLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
}

const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  globalLoading,
  onDelete,
  onToggle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isBusy={loadingIds.includes(todo.id)}
        globalLoading={globalLoading}
        onDelete={() => onDelete(todo.id)}
        onToggle={() => onToggle(todo)}
      />
    ))}
  </section>
);

export default React.memo(TodoList);
