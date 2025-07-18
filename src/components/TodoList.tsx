import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodoItem } from './TodoItem';

type Props = {
  todoList: Todo[];
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
  currentFilter: FilterType;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  loadingTodoIds,
  deleteTodo,
  currentFilter,
}) => {
  const filteredTodos = todoList.filter(todo => {
    switch (currentFilter) {
      case FilterType.all:
        return true;

      case FilterType.active:
        return !todo.completed;

      case FilterType.completed:
        return todo.completed;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
