/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header';
import { Section } from './Components/Section';
import { Footer } from './Components/Footer';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';

const USER_ID = 12083;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [error, setErrorMessege] = useState('');
  const [statusTodo, setStatusTodo] = useState('');
  const [tempTodos, setTempTodos] = useState<Todo[] | null>(null);

  const myInputRef = useRef<HTMLInputElement>(null);

  const handleClearCompleted = () => {
    const completeTodos = todos.filter(todo => todo.completed);
    const todosId = completeTodos.map(todo => todo.id);

    setTodos(currenTodos => currenTodos.filter(todo => !todo.completed));

    const newTempTodos = completeTodos.map((todo, index) => ({
      ...todo,
      id: index,
    }));

    setTempTodos(newTempTodos);

    todosId.map((id) => {
      return todoService.deleteTodos(id)
        .catch((err) => {
          setTodos(todos);
          setErrorMessege('Unable to delete a todo');
          throw err;
        })
        .finally(() => {
          setInterval(() => setErrorMessege(''), 3000);
          setTempTodos(null);
        });
    });
  };

  function filterTodos() {
    switch (statusTodo) {
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      case 'All':
        return todos;
      default: return todos;
    }
  }

  useEffect(() => {
    setErrorMessege('');
    todoService.getTodos(USER_ID)
      .then(response => setTodos(response))
      .catch(() => setErrorMessege('Unable to load todos'))
      .finally(() => setInterval(() => setErrorMessege(''), 3000));
  }, []);

  function addTodo({
    title,
    userId,
    completed,
  }: Todo) {
    setErrorMessege('');

    const newTamperTodo = {
      title,
      userId,
      completed,
      id: 0,
    };

    if (!title.trim()) {
      setErrorMessege('Title should not be empty');
      setTimeout(() => {
        myInputRef.current?.focus();
      }, 0);

      return Promise.resolve();
    }

    setTempTodo(newTamperTodo);

    return todoService.addTodos({
      title,
      userId,
      completed,
    })
      .then(
        newTodo => {
          if (newTodo.title) {
            setTodos(currentTodos => [...currentTodos, newTodo]);
          }
        },
      )
      .catch((err) => {
        setErrorMessege('Unable to add a todo');
        setTimeout(() => {
          myInputRef.current?.focus();
        }, 0);
        throw err;
      })
      .finally(() => {
        setInterval(() => setErrorMessege(''), 3000);
        setTempTodo(null);
      });
  }

  function updateCompliteTodos(updateTodo: Todo) {
    setErrorMessege('');

    return todoService.updateTodos(updateTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => (todo.id === newTodo.id
            ? { ...newTodo, completed: true }
            : todo));
        });
      })
      .catch(() => setErrorMessege('Unable to update a todo'))
      .finally(() => setInterval(() => setErrorMessege(''), 3000));
  }

  function deleteTodo(id: number) {
    const newTamperTodo = todos.find(todo => todo.id === id);

    if (newTamperTodo) {
      setTempTodo({
        ...newTamperTodo,
        id: 0,
      });
    }

    setTodos(currentPosts => currentPosts.filter(todo => todo.id !== id));

    return todoService.deleteTodos(id)
      .catch((err) => {
        setTodos(todos);
        setErrorMessege('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
        setInterval(() => setErrorMessege(''), 3000);
      });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={USER_ID}
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={addTodo}
          selectedTodo={selectedTodo}
          statusTodo={statusTodo}
          myInputRef={myInputRef}
        />

        <Section
          onSelect={(newValue) => {
            setSelectedTodo(newValue);
            updateCompliteTodos(newValue);
          }}
          filteredTodos={filterTodos()}
          // eslint-disable-next-line react/jsx-no-bind
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            onStatus={(newStatus: string) => setStatusTodo(newStatus)}
            status={statusTodo}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-dangers-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessege('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
