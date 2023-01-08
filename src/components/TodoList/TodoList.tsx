import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  todosForDelete: Todo[];
  onSetTodoForDelete: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosForDelete,
  onSetTodoForDelete,
}) => {
  const idTodosForDelete = todosForDelete.map(todo => todo.id);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          isDeleting={idTodosForDelete.includes(todo.id)}
          key={todo.id}
          onSetTodoForDelete={onSetTodoForDelete}
        />
      ))}
    </section>
  );
};
