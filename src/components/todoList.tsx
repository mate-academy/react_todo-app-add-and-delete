import { TodoItem } from './todoItem';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  filteredTodo: Todo[];
  removeTodo: (id: number) => void;
  loadingTodo: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  removeTodo,
  loadingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            removeTodo={removeTodo}
            todos={todo}
            loadingTodo={loadingTodo}
          />
        );
      })}
    </section>
  );
};

TodoList.displayName = 'TodoList';
