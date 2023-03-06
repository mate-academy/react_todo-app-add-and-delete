/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoRemoving: boolean;
  removingTodoIds: number[];
  setHasCompleted: React.Dispatch<boolean>;
  handleDeleteButtonClick: (todoId: number) => void;
};

export const Todolist: React.FC<Props> = ({
  todos,
  tempTodo,
  isTodoRemoving,
  setHasCompleted,
  removingTodoIds,
  handleDeleteButtonClick,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        if (todo.completed) {
          setHasCompleted(true);
        }

        const isLoaderVisible = isTodoRemoving
          && removingTodoIds.includes(todo.id);

        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            isLoaderVisible={isLoaderVisible}
            handleDeleteButtonClick={handleDeleteButtonClick}
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
