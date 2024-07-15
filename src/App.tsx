/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodos, createTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/filterTypes';
import { TodoList } from './TodoList/TodoList';
import { TodoFooter } from './TodoFooter/TodoFooter';
import { TodoHeader } from './TodoHeader/TodoHeader';
import { TodoErrors } from './TodoErrors/TodoErrors';
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodos, setNewTodos] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fakeTodos, setFakeTodos] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  if (!USER_ID) {
    return <UserWarning />;
  }

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setIsSubmitting(false);

      return;
    }

    const fakeTodo: Todo = {
      id: Date.now(),
      title,
      userId,
      completed,
    };

    setFakeTodos(fakeTodo);
    setIsLoading(true);

    createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [
          ...currentTodos,
          {
            id: newTodo.id,
            title: newTodo.title,
            userId: newTodo.userId,
            completed: newTodo.completed,
          },
        ]);
        setFakeTodos(null);
        setIsLoading(false);
        setNewTodos('');
        setIsSubmitting(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setFakeTodos(null);
        setIsLoading(false);
        setIsSubmitting(false);
      });
  }

  function deleteTodo(todoId: number) {
    deleteTodos(todoId).then(() => {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    });
  }

  const handleAddTodo = (event: React.FormEvent) => {
    setIsSubmitting(true);
    event.preventDefault();
    addTodo({ title: newTodos, userId: USER_ID, completed: false });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTodos={newTodos}
          setNewTodos={setNewTodos}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          isSubmitting={isSubmitting}
        />
        <TodoList
          todos={todos}
          filter={filter}
          deleteTodo={deleteTodo}
          fakeTodo={fakeTodos}
          isLoading={isLoading}
        />
        {todos.length > 0 && (
          <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>
      <TodoErrors
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
