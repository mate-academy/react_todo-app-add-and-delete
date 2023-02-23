/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useMemo, useState } from 'react';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Errors } from './Components/Errors/Errors';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterField } from './types/FilterField';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { prepareTodos } from './utils/prepareTodos';

const USER_ID = 6327;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorType.NONE);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterField>(FilterField.ALL);
  const todoCompleted = todos.filter(item => item.completed === true);
  const hasCompletedTodo = !!todoCompleted.length;
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const count = todos.length;
  const preparedTodos = prepareTodos(filterBy, todos);

  const isActive = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const loadTodoFromServer = async () => {
    try {
      const todoFromServer = await getTodos(USER_ID);

      setTodos(todoFromServer);
    } catch {
      setError(ErrorType.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    loadTodoFromServer();
  }, []);

  const errorClose = () => {
    setIsError(false);
  };

  const setFilterByField = (field: FilterField) => {
    setFilterBy(field);
  };

  const addNewTodo = async (todoTitle: string) => {
    try {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      await addTodos(USER_ID, newTodo);
      await loadTodoFromServer();
    } catch {
      setError(ErrorType.UPLOAD_ERROR);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodos(id);
      await loadTodoFromServer();
    } catch {
      setError(ErrorType.DELETE_ERROR);
    }
  };

  const removeAllCompleted = () => {
    todoCompleted.map(item => removeTodo(item.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          count={count}
          isActiveCount={isActive.length}
          addNewTodo={addNewTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={preparedTodos}
              removeTodo={removeTodo}
            />

            <Footer
              filterBy={filterBy}
              isActiveCount={isActive.length}
              onSetFilterByField={setFilterByField}
              removeAllCompleted={removeAllCompleted}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}

      </div>

      {isError
      && (
        <Errors
          errorMassage={error}
          onErrorClose={errorClose}
          isError={isError}
        />
      )}
    </div>
  );
};
