/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import {
  getTodos,
  addTodos,
  removeTodo,
} from './api/todos';
import { TempTodoItem } from './components/TempTodoItem';

const USER_ID = 10906;

enum ErrorMessages {
  load = 'Unable to load the todos',
  add = 'Unable to add a todo',
  remove = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  title = 'Title can\'t be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.load);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const clearForm = () => {
    setNewTodoTitle('');
    setTempTodo(null);
    setIsLoading(false);
    setTempTodo(null);
  };

  const newTodoData = () => ({
    userId: USER_ID,
    title: newTodoTitle,
    completed: false,
  });

  const onAddTodo = async (
  ) => {
    if (!newTodoTitle) {
      setErrorMessage(ErrorMessages.title);

      return;
    }

    try {
      setIsLoading(true);
      setTempTodo({ ...newTodoData(), id: 0 });

      const addedTodo = await addTodos(USER_ID, newTodoData());

      setTodos((prevTodos => [...prevTodos, addedTodo]));
      clearForm();
    } catch {
      clearForm();
      setErrorMessage(ErrorMessages.add);
    }
  };

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodosIds((prevIds) => [...prevIds, todoId]);
      await removeTodo(todoId);

      setTodos((prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId))));
      setLoadingTodosIds((prevIds) => prevIds.filter(prevId => prevId !== todoId));
    } catch {
      setErrorMessage(ErrorMessages.remove);
    }
  }, []);

  const handleClickDeleteError = () => {
    setErrorMessage('');
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (selectedFilter) {
      case 'Active':
        return activeTodos;

      case 'Completed':
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, selectedFilter]);

  const onDeleteCompletedTodos = async () => {
    try {
      await completedTodos.forEach(todo => {
        onDeleteTodo(todo.id);
      });
    } catch {
      setErrorMessage(ErrorMessages.remove);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            setNewTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
            setErrorMessage={setErrorMessage}
            onAddTodo={onAddTodo}
            isLoading={isLoading}
          />

        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              loadingTodosIds={loadingTodosIds}
            />
            {tempTodo && (
              <TempTodoItem tempTodo={tempTodo} />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <Filter
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
              />

              {completedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={onDeleteCompletedTodos}
                >
                  Clear completed
                </button>
              )}

            </footer>
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleClickDeleteError}
        />

        {errorMessage}
        <br />
      </div>
    </div>
  );
};
