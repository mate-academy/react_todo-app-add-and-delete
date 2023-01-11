/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  deleteTodo, getTodos, patchTodos, sendTodos,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { VisibleTodos } from './components/Todos';
import { SendedTodo } from './types/SendedTodo';
import { Todo } from './types/Todo';

const possibleStatus = ['All', 'Active', 'Completed'];

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodo, setNewTodo] = useState<SendedTodo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState('all');
  const [activeTodoId, setActiveTodoId] = useState<number[]>([0]);
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState('');
  const [isForm, setIsForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const loadTodos = async () => {
    if (user) {
      try {
        const todosFromApi = await getTodos(user?.id);

        setTodos(todosFromApi);
      } catch {
        setHidden(false);
        setError('Todos not found');
        throw new Error('Todos not found');
      }
    }
  };

  function handleAdding(isAddingStatus: boolean) {
    setIsAdding(isAddingStatus);
  }

  async function sendNewTodo(data: SendedTodo) {
    handleAdding(true);

    if (tempTodo) {
      setTodos(current => [...current, tempTodo]);
    }

    if (user && data) {
      try {
        const todoFromServer = await sendTodos(user?.id, data);

        setNewTodo(null);
        handleAdding(false);
        setTodos(current => current.map(todo => {
          if (todo.id === 0) {
            return { ...todo, id: todoFromServer.id };
          }

          return todo;
        }));
      } catch {
        setNewTodo(null);
        setHidden(false);
        handleAdding(false);
        setTodos(current => current.slice(0, current.length - 1));
        setError('Todos not added');
        throw new Error('Todos not added');
      }
    }
  }

  async function deleteTodos(todosId: number[]) {
    if (user && todosId) {
      try {
        await Promise.all(todosId.map(todoId => deleteTodo(todoId)));

        const todosToShow = todos.filter(({ id }) => !todosId.includes(id));

        setActiveTodoId([0]);
        setTodos(todosToShow);
      } catch {
        setActiveTodoId([0]);
        setHidden(false);
        setError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      }
    }
  }

  async function modifieTodo(
    todoId: number, title?: string, completed?: boolean,
  ) {
    if (user) {
      try {
        const todoFromServer = await patchTodos(todoId, title, completed);
        const todosToShow = todos.map(todo => {
          if (todo.id !== todoId) {
            return todo;
          }

          return {
            ...todo,
            title: todoFromServer.title,
            completed: todoFromServer.completed,
          };
        });

        setActiveTodoId([0]);
        setTodos(todosToShow);
      } catch {
        setActiveTodoId([0]);
        setHidden(false);
        setError('Todos not modified');
        throw new Error('Todos not modified');
      }
    }
  }

  const formActive = () => {
    setIsForm(true);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedId = completedTodos.map(todo => todo.id);

    setActiveTodoId(completedId);
    deleteTodos(completedId);
  };

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleNewTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userTodo = {
      userId: user?.id,
      title: event.target.value,
      completed: false,
    };

    const temporaryTodo = {
      id: 0,
      userId: user?.id,
      title: event.target.value,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setNewTodo(userTodo);
  };

  const closeErrorMessage = () => {
    setHidden(true);
  };

  const handleTodoChange = (
    event: React.ChangeEvent<HTMLInputElement>, todoId: number,
  ) => {
    const newTodos = todos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return {
        ...todo,
        title: event.target.value,
      };
    });

    setTodos(newTodos);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodo) {
      sendNewTodo(newTodo);
    } else {
      setHidden(false);
      setError('Title can\'t be empty');
    }

    newTodoField.current?.blur();
  };

  const removeTodo = (todoId: number) => {
    setActiveTodoId([todoId]);
    deleteTodos([todoId]);
  };

  const handleCurrentTodoChange = (
    event: React.FormEvent<HTMLFormElement> | null,
    title: string,
    todoId: number,
  ) => {
    event?.preventDefault();

    if (!title) {
      deleteTodos([todoId]);
    } else {
      modifieTodo(todoId, title);
    }

    setIsForm(false);
  };

  const handleCompleted = (
    todoId: number, title: string, completed: boolean,
  ) => {
    setActiveTodoId([todoId]);
    modifieTodo(todoId, title, completed);
  };

  useEffect(() => {
    loadTodos();

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError('');
      closeErrorMessage();
    }, 3000);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          heandlSubmit={handleSubmit}
          title={newTodo?.title || ''}
          onAdd={handleNewTodo}
          newTodoField={newTodoField}
          isAdding={isAdding}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {!!todos.length
            && (
              <VisibleTodos
                onRemove={removeTodo}
                todos={todos}
                onComplete={handleCompleted}
                onTodoChange={handleTodoChange}
                onCurrentTodoChange={handleCurrentTodoChange}
                isForm={isForm}
                onFormComplete={formActive}
                status={status}
                activeTodoId={activeTodoId}
              />
            )}
        </section>

        {!!todos.length
          && (
            <Footer
              todos={todos}
              status={status}
              onStatusChange={changeStatus}
              possibleStatus={possibleStatus}
              willClearCompleted={clearCompleted}
            />
          )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorMessage}
        />
        {error}
      </div>
    </div>
  );
};
