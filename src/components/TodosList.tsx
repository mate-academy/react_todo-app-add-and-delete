/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tmpTodo: Omit<Todo, 'userId'> | null;
  updatedTodosId: number[];
  onRemove: (id: number) => void;
  onTogle: (id: number) => void;
};

export const TodosList = ({
  todos,
  tmpTodo,
  updatedTodosId,
  onRemove,
  onTogle,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(({ id, completed, title }) => (
        <TodoItem
          id={id}
          completed={completed}
          title={title}
          key={id}
          updatedTodosId={updatedTodosId}
          onRemove={onRemove}
          onTogle={onTogle}
        />
      ))}
      {tmpTodo && (
        <TodoItem
          id={tmpTodo.id}
          completed={tmpTodo.completed}
          title={tmpTodo.title}
          updatedTodosId={[]}
          onRemove={onRemove}
          onTogle={onTogle}
        />
      )}
    </section>
  );
};
