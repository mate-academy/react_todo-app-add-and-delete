import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  handleDeleteTodo: (id: number) => void;
  deleteId: number[];
  temporaryTodo: TodoType | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  deleteId,
  temporaryTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deleteId={deleteId}
        />
      ))}

      {temporaryTodo && (
        <Todo todo={temporaryTodo} handleDeleteTodo={() => {}} deleteId={[0]} />
      )}
    </section>
  );
};
