import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => () => void,
  isLoading: boolean,
  isActiveId: number | null,
  setIsActiveId: (id: number | null) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  isLoading,
  isActiveId,
  setIsActiveId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          isActiveId={isActiveId}
          setIsActiveId={setIsActiveId}
          isLoading={isLoading}
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
