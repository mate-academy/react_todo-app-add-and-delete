/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { FilterButtons } from '../types/FilterType';
import { ToDoItem } from './ToDoItem';
type Props = {
  todos: Todo[];
  filter: FilterButtons;
  deleteTodo: (idNumber: number) => void;
  loadingTodos: number[];
  temporaryTodo: Todo | null;
};

export const TodoList = ({
  todos,
  filter,
  deleteTodo,
  loadingTodos,
  temporaryTodo,
}: Props) => {
  const filteredTodos = (filtrTodos: Todo[], filterStatus: FilterButtons) => {
    const updateTodos = [...filtrTodos];

    if (filterStatus) {
      switch (filterStatus) {
        case FilterButtons.Active:
          return updateTodos.filter(todo => !todo.completed);
        case FilterButtons.Completed:
          return updateTodos.filter(todo => todo.completed);
        default:
          break;
      }
    }

    return updateTodos;
  };

  const filteringTodos: Todo[] = useMemo(
    () => filteredTodos(todos, filter),
    [todos, filter],
  );

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
