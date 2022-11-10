import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { FilterPanel } from './components/FilterPanel';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { TodoForm } from './components/TodoForm';
import { TodoForServer } from './types/TodoForServer';

export const App: React.FC = () => {
  // Utils
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  // Error
  const [currentError, setCurrentError] = useState('');

  const resetCurrentError = () => setCurrentError('');

  // Filter
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const selectFilterType = (type: FilterType) => {
    setFilterType(type);
  };

  // Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosId = todos.filter(todo => todo.completed)
    .map(todo => todo.id);

  const addNewTodo = (todo: Todo) => {
    setTodos(cuttentTodo => [...cuttentTodo, todo]);
  };

  const loadTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
      }
    }
  };

  const visibleTodos = (): Todo[] => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Loading todos
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const addLoadingTodos = (id: number) => {
    setLoadingTodos((value) => {
      return [...value, id];
    });
  };

  // Adding
  const [isAdding, seIsAdding] = useState(false);

  const changeIsAdding = (value: boolean) => seIsAdding(value);

  // New todos
  const [newTodo, setNewTodo] = useState<TodoForServer>();
  const validTodo = newTodo?.title.trim().length;

  const setTodo = (title: string) => {
    if (user) {
      const todo = {
        userId: user?.id,
        title,
        completed: false,
      };

      if (todo.title.trim().length) {
        addLoadingTodos(0);
        setNewTodo(todo);
      } else {
        setCurrentError('title');
      }
    }
  };

  const uploadTodo = async () => {
    if (!validTodo) {
      setCurrentError('title');
    }

    if (user && newTodo && validTodo) {
      try {
        await addTodo(user.id, newTodo);
        await loadTodos();
        changeIsAdding(false);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
        setCurrentError('add');
      }
    }
  };

  // Delete todos
  const deleteTodoFromServer = async (id: number) => {
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setCurrentError('delete');
    }
  };

  const deleteCompletedTodos = () => {
    completedTodosId.forEach(todoId => addLoadingTodos(todoId));
    // eslint-disable-next-line no-restricted-syntax
    completedTodosId.forEach(todoId => deleteTodoFromServer(todoId));
  };

  // Effects
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (currentError) {
      setTimeout(() => {
        resetCurrentError();
      }, 3000);
    }
  }, [currentError]);

  useEffect(() => {
    if (newTodo) {
      addNewTodo({
        id: 0,
        ...newTodo,
      });

      changeIsAdding(true);
      uploadTodo();
    }
  }, [newTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <TodoForm
            todoField={newTodoField}
            setTodo={setTodo}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos()}
              deleteTodo={deleteTodoFromServer}
              loadingTodos={loadingTodos}
              addLoadingTodos={addLoadingTodos}
            />

            <FilterPanel
              todosCount={activeTodosCount}
              filterType={filterType}
              setFilterType={selectFilterType}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {currentError && (
        <Error error={currentError} resetError={resetCurrentError} />
      )}

    </div>
  );
};
