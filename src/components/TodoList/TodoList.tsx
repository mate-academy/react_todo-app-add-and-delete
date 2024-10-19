import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Error } from '../../types/Error';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTodos,
  deletingTodoIds,
}) => {
  return todos.map(({ id, title, completed }) => {
    return (
      <TodoItem
        key={id}
        id={id}
        title={title}
        setTodos={setTodos}
        completed={completed}
        setErrorMessage={setErrorMessage}
        deletingTodoIds={deletingTodoIds}
      />
    );
  });
};
