import React, { useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { FilterParams } from './types/FilteredParams';
import { ErrorNotification } from './Components/ErrorNotification';

const USER_ID = 11853;

function filterBy(todos: Todo[], filterValue: string) {
  let filteredTodos = todos;

  switch (filterValue) {
    case FilterParams.ACTIVE:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;

    case FilterParams.COMPLETED:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;

    case FilterParams.All:
    default:
      return filteredTodos;
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterParams.All);
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todo => setTodos(todo))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const visibleTodos = filterBy([...todos], filterValue);
  const activeItems = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          isDisableInput={isDisableInput}
          setIsDisableInput={setIsDisableInput}
          // tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={visibleTodos}
          setTodos={setTodos}
          isDisableInput={isDisableInput}
          setIsDisableInput={setIsDisableInput}
          tempTodo={tempTodo}
          // setTempTodo={setTempTodo}
        />
        {todos.length > 0 && (
          <Footer
            activeItems={activeItems}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
      />
    </div>
  );
};
