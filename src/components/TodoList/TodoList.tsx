import React from 'react';

import { Todo } from '../../types/Todo';
import { Todo as TodoItem } from '../Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  className?: string;
  deleteTodo: (todoId: number) => void;
  setErrorMessage: (message: string) => void;
  completedTodos: Todo[];
  isClearingCompletedTodos: boolean;
};

const TodoListBase: React.FC<Props> = ({
  todos,
  tempTodo,
  className,
  deleteTodo,
  setErrorMessage,
  completedTodos,
  isClearingCompletedTodos,
}) => {
  return (
    <section className={className} data-cy="TodoList">
      <div>
        {todos.map(todo => {
          let isUpdating = false;
          const isItemToBeRemoved = completedTodos.find(completeTodo => {
            return completeTodo.id === todo.id;
          });

          if (isClearingCompletedTodos && isItemToBeRemoved) {
            isUpdating = true;
          }

          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              setErrorMessage={setErrorMessage}
              isUpdating={isUpdating}
            />
          );
        })}
        {tempTodo && (
          <TodoItem key={tempTodo.id} todo={tempTodo} isUpdating={true} />
        )}
      </div>
    </section>
  );
};

export const TodoList = React.memo(TodoListBase);
