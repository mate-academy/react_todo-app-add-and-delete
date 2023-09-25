import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';
import { TempTodo } from './TempTodo';

type TodoListProps = {
  filter: Filter;
  todos: Todo[];
  handleRemove: (todoId: number) => void;
  tempTodo: Todo | null;
  deletedTodoId: number | null;
  isAddingTodo: boolean;
};

export const TodoList: React.FC<TodoListProps>
= ({
  filter, todos, handleRemove, tempTodo, deletedTodoId, isAddingTodo,
}) => {
  const visibleTodos = () => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos().map(todo => (
        <SingleTodo
          key={todo.id}
          todo={todo}
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
        />
      ))}

      {tempTodo
      && (
        <TempTodo
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
          isAddingTodo={isAddingTodo}
        />
      )}
    </section>
  );
};
