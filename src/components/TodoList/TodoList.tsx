import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[],
  TodoIdsToDelete: number[],
  deleteCurrentTodo: (todoId: number) => void,
  isAdding: boolean,
  title: string,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  deleteCurrentTodo,
  TodoIdsToDelete,
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
          TodoIdsToDelete={TodoIdsToDelete}
          todo={todo}
          deleteCurrentTodo={deleteCurrentTodo}
        />
      ))}
      {isAdding && (
        <TodoInfo
          TodoIdsToDelete={TodoIdsToDelete}
          todo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
        />
      )}
    </section>
  );
});
