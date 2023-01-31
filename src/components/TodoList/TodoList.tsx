import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  isDeletingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,
  isDeletingIds = [],
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={onTodoDelete}
            isDeletingIds={isDeletingIds}
          />
        );
      })}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onDelete={onTodoDelete}
        />
      )}
    </ul>
  );
};
