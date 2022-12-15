import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { AuthContext } from '../Auth/AuthContext';
import { Loader } from '../Loader/Loader';

interface Props {
  title: string,
  todos: Todo[]
  onTodoDelete: (value: number) => void,
  isLoading: boolean,
}

export const Todos: React.FC<Props> = (
  {
    title,
    todos,
    onTodoDelete,
    isLoading,
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
        />
      ))}

      {isLoading && (
        <Loader
          todo={{
            id: 0,
            userId: user?.id || 0,
            title,
            completed: false,
          }}
        />
      )}
    </section>
  );
};
