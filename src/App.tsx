/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { MainFilter } from './types/MainFilter';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Loader } from './components/Loader/Loader';
import { TodoError } from './components/TodoError/TodoError';

const USER_ID = 9975;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorOfUpdate, setErrorOfUpdate] = useState('');
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [filterOption, setFilterOption] = useState(MainFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [textOfInput, setTextOfInput] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const numberOfActiveTodos = todos
    .filter(({ completed }) => !completed).length;
  const numberOfCompletedTodos = todos
    .filter(({ completed }) => completed).length;

  const isInputDisabled = !!tempTodo && !!loadingIds.length;

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

  useEffect(() => {
    setErrorOfUpdate('');
    getTodosFromServer();
    setTimeout(() => setErrorOfUpdate(''), 3000);
  }, []);

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

  const addNewTodo = async (title: string) => {
    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    if (title.trim() === '') {
      setErrorOfUpdate('Title can\'t be empty');
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
      setTempTodo(null);
      setTextOfInput('');
    }
  };

  const deleteTodoItem = async (todoId: number) => {
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

    setLoadingIds(completedTodos.map(todo => todo.id));

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

    addNewTodo(textOfInput);
    setTextOfInput('');
  };

  const handleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setTextOfInput(event.target.value);
  };

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
              disabled={isInputDisabled}
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
                onDelete={deleteTodoItem}
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
      {errorOfUpdate && (
        <TodoError error={errorOfUpdate} setError={setErrorOfUpdate} />)}
    </div>
  );
};
