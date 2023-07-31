/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Filters } from './types/enumFilter';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { prepareTodos } from './utils/prepareTodos';
import { AddTodoForm } from './components/AddTodoForm';

const USER_ID = 11125;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringField, setFilteringField] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const someCompleted = todos.some(todo => todo.completed);
  const someActive = todos.some(todo => !todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load a todo');
      });
  }, []);

  const visibletodos = useMemo(
    () => prepareTodos(todos, filteringField), [todos, filteringField],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todoCount = (currentTodos: Todo[]) => {
    return currentTodos.filter(todo => !todo.completed).length;
  };

  const addTodo = (todo: Todo) => {
    setLoading(true);
    setTempTodo(todo);

    return createTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setDeleteIds(ids => [...ids, todoId]);

    return removeTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setDeleteIds(ids => ids.filter(id => id !== todoId)));
  };

  const deleteCompletedTodo = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeleteIds(completedIds);

    completedIds.forEach(id => deleteTodo(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {
            someActive
            && (
              <button type="button" className="todoapp__toggle-all active" />
            )
          }

          <AddTodoForm
            setErrorMessage={setErrorMessage}
            userId={USER_ID}
            addTodo={addTodo}
            loading={loading}
          />
        </header>

        {todos.length !== 0
          && (
            <TodoList
              todos={visibletodos}
              tempTodo={tempTodo}
              deleteIds={deleteIds}
              deleteTodo={deleteTodo}
            />
          )}

        {todos.length !== 0
          && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todoCount(todos)} items left`}
              </span>

              <Filter
                filteringField={filteringField}
                setFilteringField={setFilteringField}
              />

              {someCompleted
                && (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    onClick={deleteCompletedTodo}
                  >
                    Clear completed
                  </button>
                )}
            </footer>
          )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
