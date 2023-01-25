/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

import { createTodo, deleteTodoById, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [complitedFilter, setComplitedFilter] = useState(FilterType.ALL);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to download todos');
        });
    }
  }, []);

  const uncompletedTodosLength = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodosLength = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => {
    switch (complitedFilter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [complitedFilter, todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      const respondResult = await deleteTodoById(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));

      return respondResult;
    } catch (deleteError) {
      return setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const addTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (!title.trim()) {
          setErrorMessage('Title can\'t be empty');

          return;
        }

        setIsNewTodoLoading(true);

        if (user) {
          setTempTodo({
            id: 0,
            userId: user.id,
            title,
            completed: false,
          });

          const newTodo = await createTodo({
            userId: user.id,
            title,
            completed: false,
          });

          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
          setIsNewTodoLoading(false);
        }
      } catch (addTodoError) {
        setErrorMessage('Unable to add a todo');
      }
    }, [todos, user, title],
  );

  const clearCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          isNewTodoLoading={isNewTodoLoading}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              isNewTodoLoading={isNewTodoLoading}
            />
            <Footer
              uncompletedTodosLength={uncompletedTodosLength}
              completedTodosLength={completedTodosLength}
              complitedFilter={complitedFilter}
              setComplitedFilter={setComplitedFilter}
              clearComplitedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
