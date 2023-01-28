import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  isDeletingId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,

  isDeletingId = 0,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={onTodoDelete}
            isDeletingId={isDeletingId}
          />
        );
      })}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onDelete={onTodoDelete}
        />
      )}
    </section>
  );
};
