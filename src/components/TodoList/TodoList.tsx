import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => Promise<void>;
  isDeletingCompleted?: boolean;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  isDeletingCompleted = false,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return isDeletingCompleted ? (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            loading={todo.completed}
          />
        ) : (
          <TodoItem key={todo.id} todo={todo} onDeleteTodo={onDeleteTodo} />
        );
      })}
    </ul>
  );
});
