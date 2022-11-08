import React from 'react';
import { Todo } from '../../types/Todo';
import { AddingLoader } from '../AddingLoader/AddingLoader';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  handleDeleteTodo:(todoId: number) => void,
  deletingTodosIds: number[]
  newTitle: string,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTitle,
  handleDeleteTodo,
  deletingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodosIds={deletingTodosIds}
        />
      ))}

      {isAdding && (
        <AddingLoader newTitle={newTitle} />
      )}
    </section>
  );
};
