import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  idsTodosForDelete: number[];
  onSetTodoIdForDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  idsTodosForDelete,
  onSetTodoIdForDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          isDeleting={idsTodosForDelete.includes(todo.id)}
          key={todo.id}
          onSetTodoIdForDelete={onSetTodoIdForDelete}
        />
      ))}
    </section>
  );
};
