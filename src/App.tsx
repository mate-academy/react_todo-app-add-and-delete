/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter } from './Components/Filter/Filter';
import { DefaultFilter } from './types/DefaultFilter';
import { TodoList } from './Components/TodoList/TodoList';
import { NewTodo } from './Components/NewTodo.tsx/NewTodo';
import { UserWarning } from './UserWarning';
import { Todo } from './Components/Todo/Todo';
// eslint-disable-next-line max-len
import { ErrorNotification } from './Components/ErrorNotification';

const errorMessageOptions = {
  loadTodos: 'Unable to load todos',
  emptyTitle: 'Title should not be empty',
  newTodo: 'Unable to add a todo',
  deleteTodo: 'Unable to delete a todo',
  updateTodo: 'Unable to update a todo',
};

type TempTodo = {
  id: number;
  title: string;
};

function getVisibleTodos(selectedFilter: DefaultFilter, todos: TodoType[]) {
  if (selectedFilter === DefaultFilter.All) {
    return todos;
  }

  if (selectedFilter === DefaultFilter.Active) {
    return todos.filter(todo => todo.completed === false);
  }

  return todos.filter(todo => todo.completed === true);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<DefaultFilter>(
    DefaultFilter.All,
  );
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const formFocus = useRef(false);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);

  const timerId = useRef<ReturnType<typeof setTimeout>>();

  const filteredTodos = useMemo(
    () => getVisibleTodos(selectedFilter, todos),
    [selectedFilter, todos],
  );

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodosAvailability = todos.some(
    todo => todo.completed === true,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(errorMessageOptions.loadTodos));
  }, []);

  const handleErrorMessageRemoval = () => {
    clearTimeout(timerId.current);
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage !== '') {
      clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const showError = (newError: string) => {
    if (errorMessage === newError) {
      clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setErrorMessage(newError);
  };

  const handleNewTodo = async (inputValue: string) => {
    if (!inputValue) {
      showError(errorMessageOptions.emptyTitle);

      return false;
    }

    setDisabledInput(true);

    setTempTodo({ id: 0, title: inputValue });

    let result = false;

    await postTodo(inputValue)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        handleErrorMessageRemoval();
        result = true;
      })
      .catch(() => {
        showError(errorMessageOptions.newTodo);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });

    return result;
  };

  const handleTodoDeletion = (status: boolean, todoId?: number) => {
    if (!status) {
      showError(errorMessageOptions.deleteTodo);

      return;
    }

    if (todoId !== undefined) {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    }

    formFocus.current = !formFocus.current;
  };

  const handleCompletedTodosDeletion = async () => {
    const todosToDeleteIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodosToDelete(todosToDeleteIds);

    const results = await Promise.allSettled(
      todosToDeleteIds.map(id => deleteTodo(id)),
    );

    if (results.some(({ status }) => status === 'rejected')) {
      showError(errorMessageOptions.deleteTodo);
    }

    setTodosToDelete(() => []);

    let filterDeletedTodos = [...todos];

    results.forEach(({ status }, index) => {
      if (status === 'fulfilled') {
        filterDeletedTodos = filterDeletedTodos.filter(
          todo => todo.id !== todosToDeleteIds[index],
        );
      }
    });

    setTodos(() => filterDeletedTodos);
    formFocus.current = true;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <NewTodo
            handleNewTodo={handleNewTodo}
            disableInput={disabledInput}
            formFocus={formFocus.current}
            setFormFocus={() => (formFocus.current = !formFocus.current)}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            handleTodoDeletion={handleTodoDeletion}
            activeTodos={todosToDelete}
          />
        )}
        {tempTodo !== null && (
          <Todo
            completed={false}
            title={tempTodo.title}
            isActive={true}
            todoId={tempTodo.id}
            activeTodos={todosToDelete}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter
              filterValue={selectedFilter}
              onSelectFilter={setSelectedFilter}
            />

            {/* this button should be disabled if there are no completed todos */}

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleCompletedTodosDeletion}
              disabled={!completedTodosAvailability}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorRemoval={handleErrorMessageRemoval}
      />
    </div>
  );
};
