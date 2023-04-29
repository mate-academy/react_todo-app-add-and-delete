/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { MainFilter } from './types/MainFilter';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Loader } from './components/Loader/Loader';

const USER_ID = 9975;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorOfUpdate, setErrorOfUpdate] = useState('');
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [filterOption, setFilterOption] = useState(MainFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputStatus, setInputStatus] = useState(false);
  const [textOfInput, setTextOfInput] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [numberOfActiveTodos, numberOfCompletedTodos] = useMemo(
    () => [
      todos.filter(({ completed }) => !completed).length,
      todos.filter(({ completed }) => completed).length,
    ],
    [todos],
  );

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorOfUpdate('Something was wrong, during the loading...');
    } finally {
      setIsTodosLoading(false);
    }
  };

  const getFilteredTodos = (filter: MainFilter, someTodos: Todo[]) => {
    switch (filter) {
      case MainFilter.Active:
        return someTodos.filter((todo) => !todo.completed);
      case MainFilter.Completed:
        return someTodos.filter((todo) => todo.completed);
      default:
        return someTodos;
    }
  };

  const addSomeTodo = async (title: string) => {
    setInputStatus(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    if (title.trim() === '') {
      setErrorOfUpdate('Title can\'t be empty');
      setInputStatus(false);
      setTextOfInput('');

      return;
    }

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const newTempTodo = await addTodo(newTodo);

      setTodos(prevTodos => ([...prevTodos, newTempTodo]));
    } catch {
      setErrorOfUpdate('Unable to add a todo');
    } finally {
      setInputStatus(false);
      setTempTodo(null);
      setTextOfInput('');
    }
  };

  const deleteSomeTodo = async (todoId: number) => {
    try {
      setLoadingIds(state => [...state, todoId]);
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorOfUpdate('Unable to delete a todo');
      setTimeout(() => {
        setErrorOfUpdate('');
      }, 3000);
    } finally {
      setLoadingIds([]);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(todoItem => !todoItem.completed));
        })
        .catch(() => {
          setErrorOfUpdate('Unable to delete todos');
        });
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addSomeTodo(textOfInput);
    setTextOfInput('');
  };

  const handleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setTextOfInput(event.target.value);
  };

  useEffect(() => {
    setErrorOfUpdate('');
    getTodosFromServer();
    setTimeout(() => setErrorOfUpdate(''), 3000);
  }, []);

  const visibleTodos = getFilteredTodos(filterOption, todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={textOfInput}
              onChange={handleChange}
              disabled={inputStatus}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {isTodosLoading
            ? <Loader />
            : (
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                onDelete={deleteSomeTodo}
                loadingIds={loadingIds}
              />
            )}
        </section>

        {todos && (
          <TodoFilter
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            numberOfActiveTodos={numberOfActiveTodos}
            numberOfCompletedTodos={numberOfCompletedTodos}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>
      <div
        className={classNames(
          'notification',
          'is-danger',
          'has-text-weight-normal',
          'is-light',
          {
            hidden: !errorOfUpdate,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorOfUpdate('')}
        />
        {errorOfUpdate}
      </div>
    </div>
  );
};
