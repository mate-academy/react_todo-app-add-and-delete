import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onErrorMessage: (errMessage: string) => void;
  loadingItemsIds: number[];
  onLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodos,
  tempTodo,
  onErrorMessage,
  loadingItemsIds,
  onLoadingItemsIds,
}) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todoId={todo.id}
          onTodos={onTodos}
          todos={todos}
          todo={todo}
          onErrorMessage={onErrorMessage}
          loadingItemsIds={loadingItemsIds}
          onLoadingItemsIds={onLoadingItemsIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todoId={0}
          onTodos={onTodos}
          todos={todos}
          todo={tempTodo}
          onErrorMessage={onErrorMessage}
          loadingItemsIds={loadingItemsIds}
          onLoadingItemsIds={onLoadingItemsIds}
        />
      )}
    </>
  );
};
