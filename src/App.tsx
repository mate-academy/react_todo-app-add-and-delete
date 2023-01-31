/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  FC,
  useMemo,
  useCallback,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completedFilter, setCompletedFilter,
  ] = useState<FilterType>(FilterType.ALL);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load todos');
        });
    }

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteTodo = useCallback((todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => (
        setTodos(allTodos => allTodos.filter(todo => todo.id !== todoId))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => (
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId))));
  }, []);

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      if (user) {
        setTempTodo({
          id: 0,
          title,
          completed: false,
          userId: user.id,
        });
        setIsAdding(true);

        createTodo({
          title,
          userId: user.id,
          completed: false,
        })
          .then(newTodo => {
            setTodos(prev => [...prev, newTodo]);
          })
          .catch(() => setErrorMessage('Unable to add a todo'))
          .finally(() => {
            setIsAdding(false);
            setTitle('');
            setTempTodo(null);
          });
      }
    }, [title, user],
  );

  const visibleTodos = useMemo(() => {
    switch (completedFilter) {
      case FilterType.ALL:
        return todos;

      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [completedFilter, todos]);

  const uncompletedTodosLength = useMemo(() => {
    const unfinishedTodos = todos.filter(todo => !todo.completed);

    return unfinishedTodos.length;
  }, [todos]);

  const completedTodosLength = useMemo(() => {
    const finishedTodos = todos.filter(todo => todo.completed);

    return finishedTodos.length;
  }, [todos]);

  const clearCompletedButton = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  }, [onDeleteTodo, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          onSetTitle={setTitle}
          isAdding={isAdding}
          onFormSubmit={onFormSubmit}
        />
        {(todos.length !== 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              tempTodo={tempTodo}
              deletingTodoIds={deletingTodoIds}
            />
            <Footer
              uncompletedTodosLength={uncompletedTodosLength}
              filter={completedFilter}
              setFilter={setCompletedFilter}
              clearCompletedButton={clearCompletedButton}
              completedTodosLength={completedTodosLength}
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
