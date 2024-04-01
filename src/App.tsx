import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deleteTodoByID, setDeleteTodoByID] = useState<number | null>();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage(Errors.Load);
        throw error;
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos]);

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
    const todoToClear: Todo[] = [];

    try {
      for (const todo of todos) {
        if (todo.completed) {
          try {
            await deleteTodo(todo.id);
            todoToClear.push(todo);
          } catch {
            setErrorMessage(Errors.Delete);
          }
        }
      }

      setTodos(prevState =>
        prevState.filter(todo => !todoToClear.includes(todo)),
      );
    } catch {
      setErrorMessage(Errors.Delete);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (todosToFilter: Todo[]) => {
    let filteredTodos: Todo[] = [];

    if (selectedTasks === SelectedTasks.All) {
      filteredTodos = todosToFilter;
    }

    if (selectedTasks === SelectedTasks.Completed) {
      filteredTodos = todosToFilter.filter(todo => todo.completed === true);
    }

    if (selectedTasks === SelectedTasks.Active) {
      filteredTodos = todosToFilter.filter(todo => todo.completed === false);
    }

    return filteredTodos;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderInput
          inputRef={inputRef}
          addNewTodo={addNewTodo}
          setTitle={setTitle}
          title={title}
          disabled={isAddingTodo}
        />

        <TodoList
          todos={filterTodos(todos)}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          deleteTodoByID={deleteTodoByID}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* Show error notification only when errorMessage is not null */}

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
        {/* Show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
