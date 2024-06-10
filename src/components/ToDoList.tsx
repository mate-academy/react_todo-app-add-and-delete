/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { FilterButtons } from '../types/FilterType';
import { ToDoItem } from './ToDoItem';
type Props = {
  filteredTodos: (todos: Todo[], filterStatus: FilterButtons) => Todo[];
  todos: Todo[];
  filter: FilterButtons;
  deleteTodo: (idNumber: number) => void;
  loadingTodos: number[];
  temporaryTodo: Todo | null;
};

export const TodoList = ({
  filteredTodos,
  todos,
  filter,
  deleteTodo,
  loadingTodos,
  temporaryTodo,
}: Props) => {
  const filteringTodos = filteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.length > 0 &&
        filteringTodos.map(todo => (
          <ToDoItem
            todo={todo}
            key={todo.id}
            deleteTodo={deleteTodo}
            isLoading={loadingTodos.includes(todo.id)}
          />
        ))}

      {temporaryTodo && (
        <ToDoItem
          todo={temporaryTodo}
          isLoading={loadingTodos.includes(0)}
          deleteTodo={() => {}}
        />
      )}
    </section>
  );
};
