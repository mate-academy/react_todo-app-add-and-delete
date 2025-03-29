import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ERROR } from '../../types/enums';

type Props = {
  todos: Todo[];
  loading: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number | null) => void;
  };
  setErrorMessage: (value: ERROR) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  todosLoading: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  setErrorMessage,
  setTodos,
  todosLoading,
}) => {
  // console.log('render list');

  const onError = (message: ERROR) => {
    setErrorMessage(message);
    loading.removeIdFromLoadingList(null);
    throw new Error(message);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loading={{
            adIdToLoadingList: loading.adIdToLoadingList,
            removeIdFromLoadingList: loading.removeIdFromLoadingList,
          }}
          onError={onError}
          setTodos={setTodos}
          isLoading={todosLoading}
        />
      ))}
    </section>
  );
};
