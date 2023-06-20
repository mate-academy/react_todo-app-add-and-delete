/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { getVisibleTodos } from './utils/utils';
import { IdsContext } from './utils/Context/IdsContext';

const USER_ID = 10631;

export const filterOptions = ['All', 'Active', 'Completed'];
export const errorMessage = {
  forLoad: 'Unable to load todos',
  forAdd: 'Unable to add a todo',
  forTitle: 'the Title can not be empty',
  forDelete: 'Unable to delete a todo',
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(filterOptions[0]);
  const [isError, setIsError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorText, setErrorText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([0]);

  const validValue = searchValue.trim();

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todosFromServer, filter);
  }, [filter, todosFromServer]);

  const changeFilter = (value: string) => setFilter(value);

  const hideNotification = () => setIsHidden(true);

  const searchHandler = (value: string) => {
    setSearchValue(value);
  };

  const errorHandler = (text: string) => {
    setIsError(true);
    setErrorText(text);
    setIsHidden(false);
  };

  const updateTodosList = (todo: Todo) => {
    setTodosFromServer((prevTodos) => [...prevTodos, todo]);
  };

  const deleteTodoFromList = (deletedId: number) => {
    setTodosFromServer(todos => todos.filter(todo => todo.id !== deletedId));
  };

  const addNewTodo = (event:
  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId: USER_ID,
      title: validValue,
      completed: false,
    };

    if (validValue) {
      setTempTodo({ ...newTodo, id: 0 });

      addTodo(newTodo)
        .then(updateTodosList)
        .catch(() => {
          errorHandler(errorMessage.forAdd);
        })
        .finally(() => {
          setTempTodo(null);
          searchHandler('');
        });
    } else {
      errorHandler(errorMessage.forTitle);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  const removeTodo = (todoId: number) => {
    setDeletedIds([todoId]);
    deleteTodo(todoId)
      .then(() => {
        deleteTodoFromList(todoId);
      })
      .catch(() => {
        errorHandler(errorMessage.forDelete);
      })
      .finally(() => setDeletedIds([0]));
  };

  const clearCompletedTodos = () => {
    const completedTodosId = getVisibleTodos(todosFromServer, 'Completed')
      .map(todo => todo.id);

    setDeletedIds(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodo(id)))
      .then(() => {
        setTodosFromServer(getVisibleTodos(todosFromServer, 'Active'));
      })
      .catch(() => {
        errorHandler(errorMessage.forDelete);
      })
      .finally(() => setDeletedIds([0]));
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos(USER_ID);

        setTodosFromServer(todos);
      } catch {
        errorHandler(errorMessage.forLoad);
      }
    };

    if (!isError) {
      loadTodos();
    }

    const errorTimer = setTimeout(() => setIsError(false), 3000);

    return () => {
      clearTimeout(errorTimer);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          searchValue={searchValue}
          searchHandler={searchHandler}
          onAdd={addNewTodo}
        />

        {todosFromServer.length > 0 && (
          <IdsContext.Provider value={deletedIds}>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={removeTodo}
            />
          </IdsContext.Provider>
        )}

        {todosFromServer.length > 0 && (
          <TodoFooter
            filterOptions={filterOptions}
            todos={visibleTodos}
            filter={filter}
            changeFilter={changeFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {isError && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: isHidden,
            },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={hideNotification}
          />
          {errorText}
        </div>
      )}
    </div>
  );
};
