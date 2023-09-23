import React from 'react';
import { TodoElement } from '../Todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (id: Todo[]) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
}) => {
  const handleTodoStatusChange = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoElement
            todo={todo}
            handleTodoStatusChange={handleTodoStatusChange}
          />
        );
      })}
    </section>
  );
};
