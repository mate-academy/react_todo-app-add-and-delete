/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { USER_ID } from './App.constants';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/FilterEnum';
import { TodoForm } from './components/TodoForm.tsx';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    }
  }, []);

  const addTodo = useCallback(async (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const deleteTodo = useCallback(async (deletingTodo: Todo) => {
    try {
      await removeTodo(deletingTodo.id);
      loadTodos();
    } catch {
      setErrorMessage('Unable to delete todo');
    }

    setTempTodo(null);
  }, []);

  const deleteCompletedTodos = useCallback(async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    completedTodos.map(todo => {
      return deleteTodo(todo);
    });
  }, [todos]);

  const closeError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const activeTodosCounter = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const completedTodosCounter = todos.length - activeTodosCounter;

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm
            addTodo={addTodo}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            itemCounter={activeTodosCounter}
            completedTodosCounter={completedTodosCounter}
            selectedFilter={filter}
            onFilterSelect={setFilter}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onClose={closeError}
        />
      )}
    </div>
  );
};
