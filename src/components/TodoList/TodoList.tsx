import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />
      )}
    </section>
  );
};
