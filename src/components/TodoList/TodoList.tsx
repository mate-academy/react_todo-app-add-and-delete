import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TododInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodos: Todo | null
  handleRemoveTodo: (id: number) => void;
  deletedTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodos,
    handleRemoveTodo,
    deletedTodoIds,
  }) => {
    return (
      <>
        {todos.map(todo => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            handleRemoveTodo={handleRemoveTodo}
            deletedTodoIds={deletedTodoIds}
          />
        ))}

        {tempTodos
        && (
          <TodoInfo
            key={tempTodos.id}
            todo={tempTodos}
            deletedTodoIds={[0]}
          />
        )}
      </>
    );
  },
);
