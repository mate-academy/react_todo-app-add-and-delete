import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[] | null;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isTodoDeleted: number | null;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  isTodoDeleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isDeleting={isTodoDeleted === todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isDeleting={false}
          isTemporary
        />
      )}
    </section>
  );
};
