import React from 'react';
import { Todo } from '../types/Todo';
import { ToDo } from './Todo';
import { User } from '../types/User';

type Props = {
  List: Todo[],
  onErrorRemove: (value: boolean) => void,
  onErrorUpdate: (value: boolean) => void,
  onHidden: (value: boolean) => void,
  foundTodoList: (u: User) => void,
  isAdding: Todo | null,
  selectComplited: (todo: Todo) => Promise<void>,
  clearLoader: boolean,
  loadingAllTodos: boolean,
  onIsLoading:(value: Todo | null) => void,
  isLoading: Todo | null,
};

export const TodoLIst: React.FC<Props> = React.memo((
  {
    List,
    onErrorRemove,
    onErrorUpdate,
    onHidden,
    foundTodoList,
    isAdding,
    selectComplited,
    clearLoader,
    loadingAllTodos,
    onIsLoading,
    isLoading,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {List.map(todo => (
        <ToDo
          todo={todo}
          foundTodoList={foundTodoList}
          setErrorUpdate={onErrorUpdate}
          setErrorRemove={onErrorRemove}
          setHidden={onHidden}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onIsLoading={onIsLoading}
          isLoading={isLoading}
        />
      ))}

      {isAdding && (
        <ToDo
          todo={isAdding}
          foundTodoList={foundTodoList}
          setErrorUpdate={onErrorUpdate}
          setErrorRemove={onErrorRemove}
          setHidden={onHidden}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onIsLoading={onIsLoading}
          isLoading={isLoading}
        />
      )}
    </section>
  );
});
