import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface T {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  filterType: string,
  isLoading: boolean,
  setIsError: Dispatch<SetStateAction<boolean>>,
  tempTodo: Todo | null,
}

export enum EnumFilterTypes {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ALL = 'all',
}

export const filterTodos = (array: Todo[], type: string) => {
  switch (type) {
    case EnumFilterTypes.ACTIVE:
      return array.filter(todo => !todo.completed);

    case EnumFilterTypes.COMPLETED:
      return array.filter(todo => todo.completed);

    default:
      return array;
  }
};

export const Section: React.FC<T> = (
  {
    todos,
    setTodos,
    filterType,
    isLoading,
    setIsError,
    tempTodo,
  },
) => {
  const filteredTodos = filterTodos(todos, filterType);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      <ul className="todo-list" data-cy="todoList">
        {filteredTodos.map(todo => (
          <TodoItem
            setTodos={setTodos}
            todos={todos}
            myTodo={todo}
            isLoading={isLoading}
            setIsError={setIsError}
            key={todo.id}
            tempTodo={tempTodo}
          />
        ))}
      </ul>

    </section>
  );
};
