import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onRemoveTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, tempTodo, loadingTodoIds, onRemoveTodo } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={loadingTodoIds.includes(todo.id)}
          onRemoveTodo={onRemoveTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          onRemoveTodo={onRemoveTodo}
        />
      )}
    </section>
  );
};
