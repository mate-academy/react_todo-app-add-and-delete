import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterBy } from './types/FilterBy';
import { ErrorText } from './types/ErrorText';
import { filterByStatus } from './utils/helpers';
import { wait } from './utils/fetchClient';

const USER_ID = 10913;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorText | null>(null);
  const [showError, setShowError] = useState('');
  const [todosFilter, setTodosFilter] = useState(FilterBy.All);
  const [isHidden, setIsHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorText.onLoad);
      });
  }, []);

  if (errorMessage) {
    setShowError(errorMessage);
    setErrorMessage(null);
    setIsHidden(false);
    wait(3000)
      .then(() => setIsHidden(true));
  }

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setErrorMessage(ErrorText.onAdd);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodo(prevTodoId => [...prevTodoId, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorText.onDelete);
    } finally {
      setTempTodo(null);
      setDeletingTodo([0]);
    }
  }, []);

  const activeTodos = filterByStatus(todos, false);
  const completedTodos = filterByStatus(todos, true);

  const visibleTodos = useMemo(() => {
    switch (todosFilter) {
      case FilterBy.All:
        return todos;

      case FilterBy.Completed:
        return completedTodos;

      case FilterBy.Active:
        return activeTodos;

      default:
        throw new Error(ErrorText.onFilter);
    }
  }, [todosFilter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addTodo={addTodo} setErrorMessage={setErrorMessage} />

        {visibleTodos.length > 0
          && (
            <>
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                removeTodo={removeTodo}
                deletingTodo={deletingTodo}
              />

              <Footer
                setTodosFilter={setTodosFilter}
                todosFilter={todosFilter}
                activeTodosNumber={activeTodos.length}
                completedTodosNumber={completedTodos.length}
              />
            </>
          )}
      </div>
      <ErrorMessage
        showError={showError}
        isHidden={isHidden}
        setIsHidden={setIsHidden}
      />
    </div>
  );
};
