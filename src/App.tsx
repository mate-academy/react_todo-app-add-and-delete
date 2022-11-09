import React, {
  useCallback,
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

  // Is todos loading
  const [isAdding, setIsAdding] = useState(false);

  const changeIsAdding = (value: boolean) => {
    setIsAdding(value);
  };

  // Error
  const [currentError, setCurrentError] = useState('');

  const resetCurrentError = useCallback(
    () => setCurrentError(''),
    [currentError],
  );

  // Filter
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const selectFilterType = (type: FilterType) => {
    setFilterType(type);
  };

  // Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

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

  const filteredTodos = (): Todo[] => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // New todos
  const [newTodo, setNewTodo] = useState<TodoForServer>();
  const validTodo = newTodo?.title.trim().length;

  const setTodo = (title: string) => {
    if (user) {
      const todo = {
        userId: user.id,
        title,
        completed: true,
      };

      setNewTodo(todo);
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
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
        setCurrentError('add');
      }
    }
  };

  // Delete todos
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([0]);

  const changeSelectedTodoId = (id: number) => {
    setSelectedTodoId((value) => {
      return [...value, id];
    });
  };

  const deleteTodoFromServer = async (id: number) => {
    if (user) {
      changeIsAdding(true);
      try {
        await deleteTodo(id);
        await loadTodos();
        changeIsAdding(false);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
        setCurrentError('delete');
      }
    }
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(todoId => changeSelectedTodoId(todoId));
    // eslint-disable-next-line no-restricted-syntax
    completedTodos.forEach(todoId => deleteTodoFromServer(todoId));
  };

  // Effects
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setTimeout(() => {
      resetCurrentError();
    }, 3000);

    loadTodos();
  }, [currentError]);

  // eslint-disable-next-line no-console
  console.log(isAdding);

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
            uploadTodo={uploadTodo}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos()}
              isAdding={isAdding}
              deleteTodo={deleteTodoFromServer}
              selectId={selectedTodoId}
              setSelectId={changeSelectedTodoId}
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
