import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removingTodoIds: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const Todolist: React.FC<Props> = ({
  todos,
  tempTodo,
  removingTodoIds,
  handleDeleteTodo,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => {
        const isLoaderVisible = removingTodoIds.includes(todo.id);

        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            onDelete={handleDeleteTodo}
            isLoaderVisible={isLoaderVisible}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          tempTodo={tempTodo}
        />
      )}
    </ul>
  );
};
