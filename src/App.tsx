import { useEffect, useState, FC } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { getFilteredTodosByStatus } from './utils/getFilteredTodosByStatus';

import { deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Filter } from './types/Filters';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);

  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [isLoading, setIsLoading] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deleteTodoId, setDeleteTodoId] = useState<number[]>([]);

  const filteredTodos = getFilteredTodosByStatus(todos, filter);

  const countActiveTodos = todos.reduce((accum, todo) => {
    return !todo.completed ? accum + 1 : accum;
  }, 0);

  const handleGetTodos = () => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.LOADING);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);
    setDeleteTodoId(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setDeleteTodoId(currentIds =>
          currentIds.filter(currId => currId !== id),
        );

        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== id),
        );
        setIsLoading(false);
      })
      .catch(error => {
        setErrorMessage(Errors.DELETE_TODO);
        throw error;
      });
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              deleteTodoId={deleteTodoId}
              setDeleteTodoId={setDeleteTodoId}
              onDeleteTodo={handleDeleteTodo}
            />

            <Footer
              countActiveTodos={countActiveTodos}
              filter={filter}
              setFilter={setFilter}
              todos={todos}
              onDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
