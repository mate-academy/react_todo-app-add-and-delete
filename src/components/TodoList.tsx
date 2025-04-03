import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todoList: Todo[];
  isLoading: boolean;
  deleteTodos: (todoId: number) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
  filteredTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todoList,
  isLoading,
  deleteTodos,
  loadingIds: deletedIds,
  tempTodo,
  filteredTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {isLoading && !todoList.length ? (
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    ) : (
      filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodos={deleteTodos}
          isLoading={deletedIds.includes(todo.id)}
        />
      ))
    )}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        deleteTodos={deleteTodos}
        isLoading={deletedIds.includes(tempTodo.id)}
      />
    )}
  </section>
);
