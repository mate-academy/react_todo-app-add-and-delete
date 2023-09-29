import React from 'react';
import { TodoItem } from '../Todo/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  setErrorMessage: (str: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            setErrorMessage={setErrorMessage}
          />
        );
      })}
    </section>
  );
};
