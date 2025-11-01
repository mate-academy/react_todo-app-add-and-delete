import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
interface Props {
  todos: Todo[];
  inLoading: number[];
  handleDelete: (todoId: number) => Promise<void>;
  handleChange: (todoId: number, changed: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  inLoading,
  handleChange,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          handleDelete={handleDelete}
          handleChange={handleChange}
          loading={inLoading.includes(todo.id)}
          key={todo.id}
        />
      ))}
    </section>
  );
};
