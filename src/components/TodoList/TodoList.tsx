import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[],
  todoIdsToDelete: number[],
  deleteCurrentTodo: (todoId: number) => void,
  isAdding: boolean,
  title: string,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  deleteCurrentTodo,
  todoIdsToDelete,
  isAdding,
  title,
}) => {
  const tempTodo = {
    id: 0,
    userId: 0,
    title,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todoIdsToDelete={todoIdsToDelete}
          todo={todo}
          deleteCurrentTodo={deleteCurrentTodo}
        />
      ))}
      {isAdding && (
        <TodoInfo
          todoIdsToDelete={todoIdsToDelete}
          todo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
        />
      )}
    </section>
  );
});
