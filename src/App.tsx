/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo, createTodo } from './api/todos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [subtitleError, setSubtitleError] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!hasError) {
    setTimeout(() => {
      setHasError(true);
    }, 3000);
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
          setIsAdding(true);
        })
        .catch(() => setHasError(true));
    }
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      default:
        return todo;
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setHasError(true);
      setSubtitleError('Title can\'t be empty');
      setIsAdding(true);
    }

    if (user) {
      createTodo(user.id, title).then(newTodo => {
        setTodos([
          ...todos,
          newTodo,
        ]);
      }).catch(() => {
        setSubtitleError('Unable to add a todo');
      });
    }

    setIsAdding(false);
    setTitle('');
  };

  const handleRemove = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setHasError(true);
        setSubtitleError('Unable to delete a todo');
      }
    }, [],
  );

  const completedTodos = todos?.filter(todo => todo.completed);
  const handlerRemoveComleted = () => {
    completedTodos.forEach((todoComleted) => handleRemove(todoComleted.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        newTodoField={newTodoField}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}

      />
      <div className="todoapp__content">
        {(todos.length > 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              handleRemove={handleRemove}
              isAdding={isAdding}
            />
            <Footer
              todos={visibleTodos}
              filterLink={filter}
              setFilter={setFilter}
              todosClear={completedTodos}
              handlerRemoveComleted={handlerRemoveComleted}
            />
          </>
        )}
      </div>
      {hasError && (
        <Notification
          error={hasError}
          SetError={setHasError}
          subtitleError={subtitleError}
        />
      )}

    </div>
  );
};
