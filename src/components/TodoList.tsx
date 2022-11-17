import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { LoadingTodo } from './LoadingTodo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  title: string,
  setErrorMessage: (value: string) => void;
};

export const TodoList:React.FC<Props> = ({
  todos,
  isAdding,
  title,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map((todo: Todo) => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            setErrorMessage={setErrorMessage}
          />
        ))}

        {isAdding && <LoadingTodo title={title} />}
      </ul>
    </section>
  );
};
