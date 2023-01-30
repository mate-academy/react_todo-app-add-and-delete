import React from 'react';
import { Todo } from '../types/Todo';
import { TodoRow } from './TodoRow';

export type Props = {
  todos: Todo[],
  tempNewTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  showErrorBanner: (errorMsg: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, tempNewTodo, removeTodo, showErrorBanner,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoRow
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          showErrorBanner={showErrorBanner}
        />
      ))}

      {tempNewTodo && (

        <TodoRow
          todo={tempNewTodo}
          // eslint-disable-next-line react/jsx-boolean-value
          showLoader={true}
          removeTodo={removeTodo}
          showErrorBanner={showErrorBanner}
        />
      )}
    </section>
  );
};
