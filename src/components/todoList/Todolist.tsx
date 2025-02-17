import React from 'react';
import { Todo } from '../todo';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todos: TodoType[];
  loadingTodos: number[];
  tempTodo: TodoType | null;
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodos,
  tempTodo,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
        />
      ))}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
};
