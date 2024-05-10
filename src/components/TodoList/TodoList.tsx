import React from 'react';
import { Loader } from '../Loader/Loader';
import { Todo } from '../Todo/Todo';
import { TypeTodo } from '../../types/Todo';

interface Props {
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
  setInputFocus: (focus: boolean) => void,
  todos: TypeTodo[],
  filteredTodo: TypeTodo[],
};

export const TodoList: React.FC<Props> = ({
  isLoading, todos, filteredTodo, setIsLoading,
  setErrorMessage, setTodos, setInputFocus
}) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {isLoading
            ? <Loader />
            : (
              filteredTodo.map(todo => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  setTodos={setTodos}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setInputFocus={setInputFocus}
                  setErrorMessage={setErrorMessage}
                />
              ))
            )
          }
        </section>
      )}
    </>
  );
};

