import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../types/ConstantTypes';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  query: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  query,
  isClearCompleted,
  handleDelete,
  showError,
  hideError,
}) => {
  const creatingTodo: Todo | null = !query
    ? null
    : {
      id: 0,
      USER_ID,
      title: query,
      completed: false,
    };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          showError={showError}
          hideError={hideError}
          handleDelete={handleDelete}
          isLoading={todo.completed && isClearCompleted}
        />
      ))}

      {creatingTodo && (
        <TempTodo
          todo={creatingTodo}
          isLoading
        />
      )}
    </section>
  );
});
