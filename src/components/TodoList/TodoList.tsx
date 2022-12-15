import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[],
  deleteTodoHandler: (todoId: number) => void,
  deletedTodosIds: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodoHandler,
  deletedTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          deleteTodoHandler={deleteTodoHandler}
          deletedTodosIds={deletedTodosIds}
        />
      ))}
    </section>
  );
};
