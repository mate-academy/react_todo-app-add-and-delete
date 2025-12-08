/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
};

const TodoListComponent: React.FC<Props> = ({ todos, tempTodo }) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            selectedTodo={selectedTodo}
            isLoading={todo.isLoading}
            onSelect={setSelectedTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          isLoading={tempTodo.isLoading}
        />
      )}
    </section>
  );
};

export const TodoList = React.memo(TodoListComponent);
