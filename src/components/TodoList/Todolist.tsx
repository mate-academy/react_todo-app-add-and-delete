/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TempTodoItem } from '../TempTodoItem';
import { TodoElement } from '../TodoElement';

type Props = {
  filteredTodos: Todo[];
  loader: boolean;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  tempTodo,
  loadingIds,
  loader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoElement
          loadingIds={loadingIds}
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          loader={loader}
        />
      ))}
      {tempTodo && <TempTodoItem todo={tempTodo} />}
    </section>
  );
};
