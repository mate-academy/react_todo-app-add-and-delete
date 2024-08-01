/* eslint-disable react/display-name */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  isLoadingId: number | null;
  setIsLoadingId: (id: number | null) => void;
};

export const ListTodo: React.FC<Props> = React.memo(
  ({ todos, tempTodo, deleteTodo, isLoadingId, setIsLoadingId }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            isLoadingId={isLoadingId}
            setIsLoadingId={setIsLoadingId}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            deleteTodo={deleteTodo}
            isLoadingId={isLoadingId}
            setIsLoadingId={setIsLoadingId}
          />
        )}
      </section>
    );
  },
);
