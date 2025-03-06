/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterConstant } from './types/FilterConstants';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [addTodo, setAddTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadError, setLoadError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [actionError, setActionError] = useState('');
  const [filter, setFilter] = useState(FilterConstant.All);
  const [loadingId, setLoadingId] = useState<number>(0);

  useEffect(() => {
    getTodos()
      .then(resolve => {
        setTodos(resolve);
      })
      .catch(() => setLoadError('Unable to Load Todos'))
      .finally(() => {});
    const errorTimerId = setTimeout(() => {
      setLoadError('');
    }, 3000);

    return () => clearTimeout(errorTimerId);
  }, []);

  useEffect(() => {
    const getFilteredTodos = (filterParam: string): void => {
      const todoList: Todo[] = todos || [];

      if (filterParam === FilterConstant.Active) {
        setFilteredTodos(todoList.filter(t => t.completed === false));
      } else if (filterParam === FilterConstant.Completed) {
        setFilteredTodos(todoList.filter(t => t.completed === true));
      } else {
        setFilteredTodos([...todoList]);
      }
    };

    if ((todos?.length || 0) > 0) {
      getFilteredTodos(filter);
    }
  }, [todos, filter]);

  const isAllTodoCompleted = todos?.every(t => t.completed === true)
    ? true
    : false;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* NewTodo Component */}
        <NewTodo
          todos={todos}
          isAllTodoCompleted={isAllTodoCompleted}
          addTodo={addTodo}
          setTitleError={setTitleError}
          setAddTodo={setAddTodo}
          setActionError={setActionError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
        />

        {/* Todo List Component */}
        {(todos?.length || 0) >= 1 && (
          <TodoList
            filteredTodos={filteredTodos}
            setTodos={setTodos}
            setActionError={setActionError}
            tempTodo={tempTodo}
            loadingId={loadingId}
            setLoadingId={setLoadingId}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {(todos?.length || 0) >= 1 && (
          <Filter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setTodos={setTodos}
            setActionError={setActionError}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${loadError || titleError || actionError ? ' ' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setLoadError('');
            setTitleError('');
            setActionError('');
          }}
        />
        {/* show only one message at a time */}
        {loadError && 'Unable to load todos'}
        <br />
        {titleError && 'Title should not be empty'}
        <br />
        {actionError === 'Add' ? 'Unable to add a todo' : ''}
        <br />
        {actionError === 'delete' ? 'Unable to delete a todo' : ''}
        <br />
        {actionError === 'update' ? 'Unable to update a todo' : ''}
      </div>
    </div>
  );
};
