import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => () => void,
  isLoading: boolean,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo | null) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  isLoading,
  selectedTodo,
  setSelectedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          isLoading={isLoading}
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
