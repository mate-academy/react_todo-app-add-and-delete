import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  deletingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  deletingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingTodos={deletingTodos}
        />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
