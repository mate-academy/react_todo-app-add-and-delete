import React, { memo } from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export type Props = {
  todos: Todo[]
  deleteTodoFromData: (value: number) => void
  temporaryTodo: Todo | null
  deleteTodoIdFromArray: number[]
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  deleteTodoFromData,
  temporaryTodo,
  deleteTodoIdFromArray,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodoFromData={deleteTodoFromData}
          deleteTodoIdFromArray={deleteTodoIdFromArray}
        />
      ))}
      {temporaryTodo
        && (
          <TodoItem
            todo={temporaryTodo}
            key={temporaryTodo.id}
            deleteTodoFromData={deleteTodoFromData}
            deleteTodoIdFromArray={deleteTodoIdFromArray}
          />
        )}
    </section>
  );
});
