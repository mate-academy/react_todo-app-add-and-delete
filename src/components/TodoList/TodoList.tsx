/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todoshka } from '../Todoshka/Todoshka';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempoTodo: Todo | null;
  deletedTodo: number;
  isDeleteCompleted: boolean;
  onDelete: (todoId: number) => void;
}
export const TodoList: React.FC<Props> = ({
  todos,
  tempoTodo,
  deletedTodo,
  isDeleteCompleted,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <Todoshka
          todo={todo}
          key={todo.id}
          deletedTodo={deletedTodo}
          isDeleteCompleted={isDeleteCompleted}
          isTempoTodo={false}
          onDelete={onDelete}
        />
      ))}
      {tempoTodo && (
        <Todoshka todo={tempoTodo} isTempoTodo={true} onDelete={onDelete} />
      )}
    </section>
  );
};
