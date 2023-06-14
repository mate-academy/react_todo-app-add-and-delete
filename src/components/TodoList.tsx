import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removingTodoIds: number[];
  deleteTodoFromServer: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removingTodoIds,
  deleteTodoFromServer,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoaderVisible = removingTodoIds.includes(todo.id);

        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={deleteTodoFromServer}
            isLoaderVisible={isLoaderVisible}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
