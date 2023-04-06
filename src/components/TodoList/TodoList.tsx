import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  showError: (errorMessage: string) => void,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  showError,
  setAllTodos,
}) => {
  window.console.log('Rendering todo list');

  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const { id } = todo;

        return (
          <TodoInfo
            key={id}
            todo={todo}
            showError={showError}
            setAllTodos={setAllTodos}
          />
        );
      })}
    </section>
  );
});
