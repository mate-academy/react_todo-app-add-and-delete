/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { deleteTodoById, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { CompletedFilter } from './types/CompletedFilter';
import { Header } from './components/Header';
import { Todolist } from './components/Todolist';
import { Footer } from './components/Footer';
import { Errornotification } from './components/Errornotification';
import { filteredTodos } from './helper/Helper';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState(CompletedFilter.All);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState([0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, []);

  const closeErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodosIds(
      (currentDeletetingTodos) => [...currentDeletetingTodos, todoId],
    );

    deleteTodoById(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== todoId));

        setDeletingTodosIds(
          (currentDeletetingTodos) => (
            currentDeletetingTodos.filter(deletingId => deletingId !== todoId)
          ),
        );
      })
      .catch(() => showError('Unable to delete a todo'));
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id || 0);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTemporaryTodo={setTemporaryTodo}
          showError={showError}
          setTodos={setTodos}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <Todolist
              todos={visibleTodos}
              temporaryTodo={temporaryTodo}
              deletingTodosIds={deletingTodosIds}
              handleDeleteTodo={handleDeleteTodo}
            />
            <Footer
              completedFilter={completedFilter}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
              setCompletedFilter={setCompletedFilter}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Errornotification
          message={errorMessage}
          close={closeErrorMessage}
        />
      )}
    </div>
  );
};
