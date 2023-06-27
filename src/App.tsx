/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './enums/filter';
import { ErrorMessage } from './enums/error';
import { Error } from './components/Error';
import { TodoList } from './components/TodoList';
import { getTodos, addTodos, deleteTodo } from './api/todos';

const USER_ID = 10567;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(Filter.All);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.NONE);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos(USER_ID);
        const todosData = response as Todo[];

        setTodos(todosData);
      } catch (error) {
        setErrorMessage(ErrorMessage.LOAD);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => (
      setErrorMessage(ErrorMessage.NONE)
    ), 3000);
  }, [errorMessage]);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodosId([id]);

    deleteTodo(id)
      .then(() => {
        const newTodoList = todos.filter(todo => todo.id !== id);

        setTodos(newTodoList);
      })
      .catch(() => setErrorMessage(ErrorMessage.DELETE))
      .finally(() => setDeletedTodosId([]));
  };

  const handleClearTodo = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletedTodosId(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodo(id)))
      .then(() => {
        const filteredTodos = todos.filter(todo => !todo.completed);

        setTodos(filteredTodos);
      })
      .catch(() => setErrorMessage(ErrorMessage.DELETE))
      .finally(() => setDeletedTodosId([]));
  };

  const handleAddTodo = (event:
  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value) {
      setIsLoading(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: value,
        completed: false,
      });

      const newTodo = {
        id: Math.max(...todos.map(todo => todo.id)) + 1,
        userId: USER_ID,
        title: value,
        completed: false,
      };

      addTodos(USER_ID, newTodo)
        .then(() => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => setErrorMessage(ErrorMessage.ADD))
        .finally(() => {
          setValue('');
          setIsLoading(false);
          setTempTodo(null);
        });
    } else {
      setErrorMessage(ErrorMessage.EMPTY);
    }
  };

  const filteredTodos = useMemo(() => {
    return todos?.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterValue]);

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const amountOfActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          amountOfActiveTodos={amountOfActiveTodos}
          value={value}
          setValue={setValue}
          handleAddTodo={handleAddTodo}
          isLoading={isLoading}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletedTodosId={deletedTodosId}
              handleDeletedTodo={handleDeleteTodo}
            />

            <Footer
              filterValue={filterValue}
              setFilter={setFilterValue}
              hasCompletedTodos={hasCompletedTodos}
              amountOfActiveTodos={amountOfActiveTodos}
              handleClearTodo={handleClearTodo}
            />
          </>
        )}
      </div>

      {!!errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
