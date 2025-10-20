import React, { useEffect, useMemo, useState } from 'react';

import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Header } from '../components/Header';
import { TodoItem } from '../components/TodoItem';
import { Error } from '../components/Error';
import { ErrorType } from '../types/ErrorType';
import { FilterType } from '../types/FilterType';
import { Footer } from '../components/Footer';
import { Loader } from '../components/Loader';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [filterStatus, setFilterStatus] = useState<FilterType>(FilterType.All);
  const [loading, setLoading] = useState(true);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterType.All) {
          return true;
        }

        return filterStatus === FilterType.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterStatus],
  );

  const todosLeftNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
        setLoading(false);
      } catch (err) {
        setErrorMessage(ErrorType.LoadTodos);
      }
    })();
  }, []);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilterStatus(newFilter);
  };

  const handleClearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  return (
    <div className="todoapp">
      <div className="todoapp__content">
        <Header />
        {loading && <Loader />}
        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </section>
            <Footer
              filterStatus={filterStatus}
              setFilterStatus={handleFilterChange}
              todosLeft={todosLeftNum}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>
      <Error error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
