import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TypeTodo } from '../../types/Todo';

interface Props {
  todos: TypeTodo[],
  isLoading: boolean,
  tempTodo: TypeTodo | null;
  filteredTodo: TypeTodo[],
  setInputFocus: (focus: boolean) => void,
  setIsLoading: (isLoading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
};

export const TodoList: React.FC<Props> = ({
  todos, filteredTodo, setIsLoading,
  setErrorMessage, setTodos, setInputFocus, tempTodo
}) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodo.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              setTodos={setTodos}
              setIsLoading={setIsLoading}
              setInputFocus={setInputFocus}
              setErrorMessage={setErrorMessage}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              setTodos={setTodos}
              setIsLoading={setIsLoading}
              setInputFocus={setInputFocus}
              setErrorMessage={setErrorMessage}
              isTemp
            />
          )}
        </section>
      )}
    </>
  );
};

