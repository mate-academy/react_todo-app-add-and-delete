import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  setTodos,
  setErrorMessage,
  setDeletingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          deletingIds={deletingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setDeletingIds={setDeletingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
