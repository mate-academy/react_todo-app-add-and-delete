/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { ForComletedTodo } from './types/enumFilter';
import { TodoItem } from './Components/TodoItem';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [condition, setCondition] = useState(ForComletedTodo.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasTodos = todos.length > 0;

  const isAllCopleted = todos.every(todo => todo.completed);

  const fetchData = async () => {
    try {
      setErrorMessage(null);
      const todosFetch = await todoService.getTodos();

      setTodos(todosFetch);
    } catch (err) {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearInterval(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const hadleAddTodo = (title: string) => {
    return todoService
      .addTodo(title)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    todoService.updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      });
  };

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (condition) {
      case ForComletedTodo.Active:
        return !completed;
      case ForComletedTodo.Completed:
        return completed;
      default:
        return 1;
    }
  }), [condition, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          isAllCopleted={isAllCopleted}
          hasTodos={hasTodos}
          onTodoAdd={hadleAddTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              onTodoUpdate={(todoTitle) => handleUpdateTodo(todo, todoTitle)}
            />
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <Footer
            todos={todos}
            condition={condition}
            setCondition={setCondition}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />

        {errorMessage}

        {/*
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
