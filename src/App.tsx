import React, { useEffect, useRef, useState } from 'react';
import { addTodo, delTodo, get } from './api/todos';
import { TodoInterface } from './types/Todo';
import { Filter } from './types/filter';
import { TodoList } from './components/todoList/todoList';
import { FilteredTodoList } from './components/footer/filteredTodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [value, setValue] = useState('');
  const [tempTodo, setTempTodo] = useState<TodoInterface | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [todosForDelete, setTodosForDelete] = useState<number[]>([]);

  const inputForFocusRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hideNotification = () => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }
  };

  const errorHandling = (error: Error) => {
    if (notificationRef.current) {
      notificationRef.current.classList.remove('hidden');
      setErrorMessage(error.message);
      setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.classList.add('hidden');
        }
      }, 3000);
    }
  };

  const newId = () => {
    const maxId = Math.max(0, ...todos.map(todo => todo.id));

    return maxId + 1;
  };

  const errorManagement = (er: unknown) => {
    if (er instanceof Error) {
      errorHandling(er);
    }
  };

  const createTodo = (id: number, title: string): TodoInterface => ({
    id,
    userId: 2039,
    title: title.trim(),
    completed: false,
  });

  useEffect(() => {
    if (inputForFocusRef.current) {
      inputForFocusRef.current.focus();
    }

    const fetchTodos = async () => {
      try {
        hideNotification();

        const data = await get();

        setTodos(data);
      } catch (error) {
        if (error instanceof Error) {
          errorHandling(error);
        }
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (inputForFocusRef.current) {
      inputForFocusRef.current.focus();
    }
  });

  const deleteTodos = async (content: number[]) => {
    for (const todoId of content) {
      try {
        hideNotification();

        await delTodo(todoId);

        setTodos(current => current.filter(item => todoId !== item.id));
      } catch (error) {
        errorManagement(error);
      }
    }

    setTodosForDelete([]);
  };

  const addTodos = async (data: string) => {
    if (inputForFocusRef.current) {
      inputForFocusRef.current.focus();
    }

    setTempTodo(() => createTodo(0, data));

    try {
      hideNotification();

      await addTodo(data);

      const newTodo = createTodo(newId(), data);

      setTodos(current => [...current, newTodo]);

      setValue('');
    } catch (error) {
      errorManagement(error);
      setValue(value);
    } finally {
      setTempTodo(null);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim()) {
      addTodos(value);
    } else {
      const empty = new Error('Title should not be empty');

      errorHandling(empty);
      setValue('');
    }
  };

  const handleClose = () => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }
  };

  const filteredTodos = (): TodoInterface[] => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.All:
          return true;
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }

    setValue(e.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={onSubmit}>
            <input
              ref={inputForFocusRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={handleChangeValue}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos()}
            deleteTodos={deleteTodos}
            tempTodo={tempTodo}
            setTodosForDelete={setTodosForDelete}
            todosForDelete={todosForDelete}
          />
        )}

        {todos.length > 0 && (
          <FilteredTodoList
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            deleteTodos={deleteTodos}
            setTodosForDelete={setTodosForDelete}
            todosForDelete={todosForDelete}
          />
        )}
      </div>

      <div
        ref={notificationRef}
        data-cy="ErrorNotification"
        className="notification 
        is-danger is-light has-text-weight-normal hidden"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleClose}
        />
        {errorMessage}
      </div>
    </div>
  );
};
