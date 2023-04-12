import React from 'react';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';

interface Props {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => Promise<void>
  todoInLoading: number,
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    onDeleteTodo,
    todoInLoading,
  }) => {
    return (
      <section className="todoapp__main">
        {todos.map(todo => (
          <SingleTodo
            todo={todo}
            key={todo.id}
            onDelete={onDeleteTodo}
            todoInLoading={todoInLoading}
          />
        ))}
      </section>
    );
  },
);
