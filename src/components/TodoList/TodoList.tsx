import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInput } from '../TodoInput/TodoInput';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodoClick: (id: number) => void;
  isDeletedTodoHasLoader: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodoClick,
  isDeletedTodoHasLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInput
          todo={todo}
          key={todo.id}
          handleDeleteTodoClick={handleDeleteTodoClick}
          isDeletedTodoHasLoader={isDeletedTodoHasLoader}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
