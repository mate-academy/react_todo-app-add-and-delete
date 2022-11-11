/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { createTodo, deleteTodo, getTodos } from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import {
  TodoError,
} from './components/TodoError/TodoError';
import { Footer } from './components/Footer/Footer';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';

import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>({
    status: false,
    message: '',
  });
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const showError = useCallback((message: string) => {
    setError({ status: true, message });

    setTimeout(() => {
      setError({ status: false, message: '' });
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        showError('Unable to load todos');
      }
    }
  }, []);

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          showError('Title can\'t be empty');
          setIsAdding(false);

          return;
        }

        await createTodo(todoTitle, user.id);
        await loadTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        showError('Unable to add a todo');
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      showError('Unable to delete a todo');
      setDeletedTodoIds([]);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodoIds(completedTodoIds);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      await loadTodos();
    } catch {
      showError('Unable to delete a todo');
      setDeletedTodoIds([]);
    }
  }, [todos]);

  const handleFilterSelect = useCallback((filterType: FilterType) => {
    setFilterBy(filterType);
  }, []);

  const handleCloseError = useCallback(() => {
    setError({ status: false, message: '' });
  }, []);

  const handleChangeTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterType.ALL:
          return todo;

        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterBy, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            todoTitle={todoTitle}
            onChangeTodoTitle={handleChangeTodoTitle}
            submitNewTodo={handleAddNewTodo}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              todoTitle={todoTitle}
              onDeleteTodo={handleDeleteTodo}
              isAdding={isAdding}
              deletedTodoIds={deletedTodoIds}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              onFilter={handleFilterSelect}
              onDeleteAllTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      <TodoError
        error={error}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
