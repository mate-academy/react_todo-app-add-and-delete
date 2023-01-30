/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, deleteTodo, addTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorType.ADD));
    }
  }, []);

  const onAddTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (!title.trim()) {
          setErrorMessage(ErrorType.EMPTY);

          return;
        }

        setIsAddingTodo(true);

        if (user) {
          setTempTodo({
            id: 0,
            userId: user.id,
            title,
            completed: false,
          });

          const newTodo = await addTodo({
            userId: user.id,
            title,
            completed: false,
          });

          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
          setIsAddingTodo(false);
        }
      } catch (addTodoError) {
        setErrorMessage(ErrorType.ADD);
      }
    }, [todos, user, title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(
        todo => todo.id !== todoId,
      ));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(ErrorType.REMOVE);
    }
  }, []);

  const removeCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterType.ALL:
      default:
        return todos;
    }
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
          title={title}
          setTitle={setTitle}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
              isAddingTodo={isAddingTodo}
            />
            <Footer
              activeTodos={activeTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              removeCompletedTodos={removeCompletedTodos}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          closeErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
