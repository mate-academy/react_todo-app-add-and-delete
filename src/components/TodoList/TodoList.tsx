import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isNewTodoLoading: boolean;
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos, onDeleteTodo, tempTodo, isNewTodoLoading,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map((todo) => (
          <TodoInfo todo={todo} onDeleteTodo={onDeleteTodo} />
        ))}

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            isNewTodoLoading={isNewTodoLoading}
          />
        )}
      </section>
    );
  },
);
