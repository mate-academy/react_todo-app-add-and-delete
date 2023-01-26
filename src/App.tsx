/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  memo,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo, createTodo } from './api/todos';

export const App: React.FC = memo(() => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isTodoAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setIsError(true);
          setErrorMessage('Can\'t load todos');
        });
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.All:
        return todos;

      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        throw new Error('Invalid type');
    }
  }, [todos, filterType]);

  const amountOfActiveTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  const handleCloseErrorMessage = () => {
    setIsError(false);
  };

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
      setErrorMessage('');
      setIsError(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setIsError(true);
    }
  }, []);

  const removeAllCompleted = useCallback(() => {
    return todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  const addNewTodo = useCallback(async (newTitle: string) => {
    if (!newTitle.trim()) {
      setIsError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsAdding(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          userId: user?.id,
          title: newTitle.trim(),
          completed: false,
        });

        const newTodo = await createTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(currentTodos => [
          ...currentTodos, newTodo,
        ]);
        setErrorMessage('');
        setIsError(false);
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        setIsError(true);
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          onAddTodo={addNewTodo}
          isAdding={isTodoAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onTodoDelete={removeTodo}
              tempTodo={tempTodo}
            />
            <Footer
              amountOfActiveTodos={amountOfActiveTodos}
              hasCompletedTodos={hasCompletedTodos}
              filterType={filterType}
              onChangeType={setFilterType}
              onRemoveCompleted={removeAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        isError={isError}
        errorMessage={errorMessage}
        onCloseErrorMessage={handleCloseErrorMessage}
      />
    </div>
  );
});
