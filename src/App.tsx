/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoInfo } from './components/TodoInfo';

import { addTodo, deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterLink';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [idsTodosForDelete, setIdsTodosForDelete] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodosFromServer)
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
  }, [isAdding]);

  const handleChangeNewTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => (
    setNewTodoTitle(event.currentTarget.value)
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setIsError(true);
      setErrorMessage('Title can\'t be empty');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setIsAdding(true);

      addTodo(user.id, newTodoTitle)
        .then((addedTodo) => {
          setTodosFromServer(currentTodos => (
            [...currentTodos,
              {
                id: addedTodo.id,
                userId: addedTodo.userId,
                title: addedTodo.title,
                completed: addedTodo.completed,
              },
            ]
          ));
          setNewTodoTitle('');
        })
        .catch(() => {
          setIsError(true);
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
        });
    }
  };

  const handleClickCloseErrorMessage = () => {
    setIsError(false);
  };

  const setNewFilterStatus = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const visibleTodos = todosFromServer.filter(todo => {
    switch (filterStatus) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const setTodoIdForDelete = (selectedTodoId: number) => {
    setIdsTodosForDelete(currentIdsTodosForDelete => (
      [...currentIdsTodosForDelete, selectedTodoId]
    ));

    deleteTodo(selectedTodoId)
      .then(() => (
        setTodosFromServer(currentTodos => currentTodos.filter(
          todo => todo.id !== selectedTodoId,
        ))
      ))
      .catch(() => {
        setIsError(true);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIdsTodosForDelete([]));
  };

  const handleClickClearCompletedTodos = () => {
    todosFromServer.forEach(todo => {
      if (todo.completed) {
        setTodoIdForDelete(todo.id);
      }
    });
  };

  const amountOfTodosToComplete = todosFromServer.filter(
    todo => !todo.completed,
  ).length;

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

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

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleChangeNewTodoTitle}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          idsTodosForDelete={idsTodosForDelete}
          onSetTodoIdForDelete={setTodoIdForDelete}
        />
        {tempTodo && <TodoInfo todo={tempTodo} isAdding={isAdding} />}

        {todosFromServer.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${amountOfTodosToComplete} items left`}
            </span>

            <Filter onSetFilterStatus={setNewFilterStatus} />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={amountOfTodosToComplete === todosFromServer.length}
              onClick={handleClickClearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        isError={isError}
        onCloseErrorMessage={handleClickCloseErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
