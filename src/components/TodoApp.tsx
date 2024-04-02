import { useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { Errors } from '../enums/Errors';
import { ErrorNotification } from './ErrorNotification';
import { FilteredTodos } from '../enums/FilteredTodos';

const handleFilteredTodos = (todos: Todo[], filterSelected: FilteredTodos) => {
  switch (filterSelected) {
    case FilteredTodos.active:
      return todos.filter(todo => !todo.completed);
    case FilteredTodos.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterSelected, setFilterSelected] = useState<FilteredTodos>(
    FilteredTodos.all,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  const preparedTodos = handleFilteredTodos(todos, filterSelected);
  const activeTodos = handleFilteredTodos(todos, FilteredTodos.active);
  const completedTodos = handleFilteredTodos(todos, FilteredTodos.completed);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const showError = (error: Errors) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    const clearError = setTimeout((error: Errors) => {
      setErrorMessage(error);
    }, 3000);

    return () => clearTimeout(clearError);
  }, [errorMessage, setErrorMessage]);

  useEffect(() => {
    setFocusInput(true);

    getTodos()
      .then(setTodos)
      .catch(() => showError(Errors.LoadTodos));
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    return createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        showError(Errors.AddTodo);
        throw error;
      });
  };

  const delTodo: (id: number) => Promise<void> = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setFocusInput(true);
      })
      .catch((error: unknown) => {
        showError(Errors.DeleteTodo);
        throw error;
      });
  };

  const onCompleteDelete = useMemo(() => {
    return () => {
      todos.filter(todo => todo.completed).forEach(todo => delTodo(todo.id));
    };
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setFocusInput={setFocusInput}
          focusInput={focusInput}
          clearErrorMessage={clearErrorMessage}
        />

        <TodoList
          preparedTodos={preparedTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          deleteTodo={delTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onCompleteDelete={onCompleteDelete}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
