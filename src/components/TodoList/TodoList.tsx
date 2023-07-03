import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  tempTodo: Todo | null;
  todos: Todo[];
  onRemoveTodo: (id: number) => void;
  loadingtodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = memo(({
  tempTodo,
  todos,
  onRemoveTodo,
  loadingtodoIds,
}) => {
  const loadedTodos = tempTodo
    ? [...todos, tempTodo]
    : todos;

  return (
    <section className="todoapp__main">
      {loadedTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          loadingtodoIds={loadingtodoIds}
        />
      ))}
    </section>
  );
});
