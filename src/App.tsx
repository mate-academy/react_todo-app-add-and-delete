/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { MESSAGE, ACTION } from './const';
import { FilterState } from './types/FilterState';

const getFilteredTodo = (todos: Todo[], query: FilterState): Todo[] => {
  if (query === 'All') {
    return todos;
  }

  return todos.filter(todo => todo.completed === (query === 'Completed'));
};

function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export const App: React.FC = () => {
  const [loadingTodoId, setLoadingTodoId] = useState<Todo['id'] | null>(null);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(FilterState.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [lastOperation, setLastOperation] = useState<ACTION>(ACTION.UNKNOWN);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(MESSAGE.UNABLE_LOAD));
  }, []);

  useEffect(() => {
    setFilteredTodos(getFilteredTodo(todos, filterState));
  }, [filterState, todos]);

  useEffect(() => {
    if (errorMessage) {
      const timeOutId = setTimeout(() => setErrorMessage(''), 3000);

      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [errorMessage]);

  useEffect(() => {
    if ([ACTION.ADD, ACTION.DELETE].includes(lastOperation)) {
      inputRef.current?.focus();
    }
  }, [lastOperation, filteredTodos, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const onAdd = (todo: Partial<Todo>) => {
    setErrorMessage('');
    if (todo.title === undefined || todo.title.trim() === '') {
      return Promise.resolve().then(() => {
        setErrorMessage(MESSAGE.TITLE_EMPTY);
        new Error(MESSAGE.TITLE_EMPTY);
      });
    }

    const newTodo: Todo = {
      id: 0,
      completed: false,
      userId: USER_ID,
      ...todo,
      title: todo.title.trim(),
    };

    setTempTodo({ ...newTodo });

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    return postTodo(newTodo)
      .then(serverTodo => {
        setTodos([...todos, serverTodo]);
      })
      .catch(error => {
        setErrorMessage(MESSAGE.UNABLE_ADD);
        throw Error(error);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setLoadingTodoId(null);
        setTempTodo(null);
        setLastOperation(ACTION.ADD);
      });
  };

  const onChange = (todo: Todo, fieldsToUpdate: Partial<Todo>) => {
    setLoadingTodoId(todo.id);

    return wait(1)
      .then(() => {
        const updatedTodo = { ...todo, ...fieldsToUpdate };
        const updatedTodos = [...todos];
        const index = updatedTodos.findIndex(
          currentTodo => currentTodo.id === todo.id,
        );

        updatedTodos.splice(index, 1, updatedTodo);
        setTodos(updatedTodos);
      })
      .catch(error => {
        setErrorMessage(MESSAGE.UNABLE_UPDARE);
        throw Error(error);
      })
      .finally(() => {
        setLoadingTodoId(null);
        setLastOperation(ACTION.UNKNOWN);
      });
  };

  const onDelete = (todo: Todo) => {
    setErrorMessage('');
    setLoadingTodoId(todo.id);

    return deleteTodo(todo.id)
      .then(() =>
        setTodos(todos.filter(currentTodo => todo.id !== currentTodo.id)),
      )
      .catch(() => setErrorMessage(MESSAGE.UNABLE_DELETE))
      .finally(() => {
        setLoadingTodoId(null);
        setLastOperation(ACTION.DELETE);
      });
  };

  const onFilter = (currentState: FilterState) => {
    setFilterState(currentState);
    setLastOperation(ACTION.UNKNOWN);
  };

  const onClearCompleted = () => {
    setErrorMessage('');
    setLoadingCompleted(true);
    const deleteTodos = filteredTodos.filter(todo => todo.completed);
    const deleteIds: Todo['id'][] = [];
    let hasDeleteError = false;

    const promises = deleteTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(promises).then(results =>
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          deleteIds.push(deleteTodos[index].id);
        } else {
          hasDeleteError = true;
        }

        if (deleteIds.length > 0) {
          setTodos(todos.filter(todo => !deleteIds.includes(todo.id)));
        }

        setLoadingCompleted(false);
        setLastOperation(ACTION.DELETE);

        if (hasDeleteError) {
          setErrorMessage(MESSAGE.UNABLE_DELETE);
        }
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={onAdd} inputRef={inputRef} />
        {todos.length ? (
          <>
            <TodoList
              lodingId={loadingTodoId}
              loadingCompleted={loadingCompleted}
              todos={filteredTodos}
              tempTodo={tempTodo}
              onChange={onChange}
              onDelete={onDelete}
            />

            <Footer
              itemsLeft={itemsLeft}
              filterState={filterState}
              disableClearButton={
                !filteredTodos.some(todo => todo.completed === true)
              }
              onFilter={onFilter}
              onClearCompleted={onClearCompleted}
            />
          </>
        ) : null}
      </div>

      <Notification
        errorMessage={errorMessage}
        onClearMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
