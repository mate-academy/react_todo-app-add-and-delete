/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoItem } from './TodoItem';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  filter: Filter,
  onDelete?: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodosPause: number[];
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  filter,
  onDelete = () => { },
  loadingTodosPause,
  tempTodo,
}) => {
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.active:
        return !todo.completed;

      case Filter.completed:
        return todo.completed;

      case Filter.all:
        return todo;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todoItem={todo}
            onDelete={() => onDelete(todo.id)}
            loader={loadingTodosPause.includes(todo.id)}
          />
        ))
      }
      {tempTodo && (
        <TodoItem
          todoItem={tempTodo}
          onDelete={onDelete}
          loader
        />
      )}
    </section>
  );
});
