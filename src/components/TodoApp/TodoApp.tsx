import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { getTodos } from '../../api/todos';
import { useTodos } from '../hooks/useTodos';

import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Notification } from '../Notification';

import { Todo } from '../../types/Todo';
import { ShowError } from '../../types/ShowErrors';
import { ShowTodos } from '../../types/StatusTodo';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<ShowTodos>(ShowTodos.All);

  const [error, setError] = useState<ShowError | null>(null);
  const hideError = () => setError(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    setError(null);

    getTodos()
      .then(newTodos => setTodos(newTodos))
      .catch(() => setError(ShowError.fetchTodos));
  }, []);

  const handleSelectedTodos = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      switch (event.currentTarget.textContent) {
        case 'Active':
          setSelectedTodos(ShowTodos.Active);
          break;

        case 'Completed':
          setSelectedTodos(ShowTodos.Completed);
          break;

        default:
          setSelectedTodos(ShowTodos.All);
          break;
      }
    }, [],
  );

  const isEmptyTodos = useMemo(() => {
    return todos.length === 0;
  }, [todos]);

  const filteredTodos = useTodos(todos, selectedTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />

        {!isEmptyTodos && (
          <>
            <TodoList todos={filteredTodos} />

            <Footer
              todos={todos}
              selectedTodos={selectedTodos}
              handleSelectedTodos={handleSelectedTodos}
            />
          </>
        )}
      </div>

      <Notification error={error} hideError={hideError} />
    </div>
  );
};
