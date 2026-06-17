/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodoApi, getTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [text, setText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedTitle = text.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.TitleEmpty);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsAdding(true);

    const newTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then((oneTodo: Todo) => {
        setTodos(prev => [...prev, oneTodo]);
        setText('');
      })
      .catch(() => {
        setErrorMessage(Errors.Add);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const deleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodoApi(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(procId => procId !== id));
        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const visibleTodos = todos.filter((todo: Todo) => {
    if (filter === 'Active') {
      return !todo.completed;
    }

    if (filter === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

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

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              disabled={isAdding}
              ref={newTodoField}
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || !!tempTodo) && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClear={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
