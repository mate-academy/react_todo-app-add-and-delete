import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  deleteTodo: (todoId: number) => Promise<void>,
  updateTodoStatus: (todo: Todo, status: boolean) => Promise<void>,
  updateTodoTitle: (todo: Todo, title: string) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            updateTodoStatus={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
          />
        );
      })}
    </ul>
  );
};
