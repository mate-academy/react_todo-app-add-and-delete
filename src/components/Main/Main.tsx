import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setErrorMessage: (message: string) => void;
  showErrorCallback: () => void;
};

export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  setErrorMessage,
  showErrorCallback,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(({ title, completed, id }) => {
        return (
          <TodoItem
            title={title}
            completed={completed}
            id={id}
            key={id}
            setErrorMessage={setErrorMessage}
            showErrorCallback={showErrorCallback}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          id={tempTodo.id}
          completed={tempTodo.completed}
        />
      )}
    </ul>
  );
};
