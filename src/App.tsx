import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { HeaderInput } from './components/HeaderInput';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { Errors, SelectedTasks, Todo } from './types/Types';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<SelectedTasks>(
    SelectedTasks.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [title, setTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deleteTodoByID, setDeleteTodoByID] = useState<number | null>();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.Load));
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    const input = document.querySelector('input') as HTMLInputElement;

    if (input) {
      input.focus();
    }

    if (!title.trim()) {
      if (input) {
        input.focus();
      }
    }
  }, [tempTodo, todos, title]);

  const addNewTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsAddingTodo(true);

    const temp = {
      title: trimmedTitle,
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setErrorMessage(null);

    postTodo(temp)
      .then(res => {
        setTodos(prev => [...prev, res]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.Add))
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
      });
  };

  const deleteCurrentTodo = useCallback((id: number) => {
    setDeleteTodoByID(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => setDeleteTodoByID(null));
  }, []);

  const clearCompleted = async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const deletePromises = completedTodoIds.map(id =>
        deleteTodo(id)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.filter(prevTodo => prevTodo.id !== id),
            );
          })
          .catch(() => {
            setErrorMessage(Errors.Delete);
          }),
      );

      await Promise.allSettled(deletePromises);
    } catch (error) {
      setErrorMessage(Errors.Delete);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (todosToFilter: Todo[]) => {
    let filteredTodos: Todo[] = [];

    switch (selectedTasks) {
      case SelectedTasks.All:
        filteredTodos = todosToFilter;
        break;
      case SelectedTasks.Completed:
        filteredTodos = todosToFilter.filter(todo => todo.completed === true);
        break;
      case SelectedTasks.Active:
        filteredTodos = todosToFilter.filter(todo => todo.completed === false);
        break;
      default:
        filteredTodos = todosToFilter;
        break;
    }

    return filteredTodos;
  };

  const filteredTodos = filterTodos(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderInput
          addNewTodo={addNewTodo}
          setTitle={setTitle}
          title={title}
          disabled={isAddingTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          deleteTodoByID={deleteTodoByID}
        />

        {!!todos?.length && (
          <Footer
            todos={todos}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
