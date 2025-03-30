import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  handleDeleteTodo: (id: number) => void;
  isLoadingTodo: number[];
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ filteredTodos, handleDeleteTodo, isLoadingTodo, handleUpdateTodo }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              isLoadingTodo={isLoadingTodo}
              handleUpdateTodo={handleUpdateTodo}
            />
          );
        })}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
