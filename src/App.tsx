/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Filters, Todo } from './types/Todo';
import { filterTodos } from './utils/services';
import TodoItem from './components/TodoItem';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.All);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);

  const filtered = useMemo(
    () => filterTodos(todos, activeFilter),
    [todos, activeFilter],
  );

  const addTodo = (title: string) => {
    setTempTodo({
      id: 0,
      userId: postService.USER_ID,
      title: title,
      completed: false,
    });
    setIsLoading(true);

    return postService
      .createTodo(title)
      .then(newTodo => {
        setDeletingTodos(current => [...current, 0]);

        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const loadTodos = useCallback(() => {
    setIsLoading(true);
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setIsLoading(true);
    setDeletingTodos(current => [...current, id]);
    postService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setDeletingTodos([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setDeletingTodos(current => [...current, todo.id]);
      deleteTodo(todo.id);
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [errorMessage]);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onCreateTodo={addTodo}
          isLoading={isLoading}
          setErrorMessage={setErrorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filtered.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={deleteTodo}
                  deletingTodos={deletingTodos}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="item">
                <TodoItem
                  key={tempTodo.id}
                  todo={tempTodo}
                  onDelete={deleteTodo}
                  deletingTodos={deletingTodos}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
