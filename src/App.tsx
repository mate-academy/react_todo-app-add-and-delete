import React, { useEffect, useState, useRef } from 'react';
import { getTodos, deleteTodo, addTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { TempTodo } from './components/TempTodo';

export enum TypeFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const listOfActiveTodos = todosList.filter(todo => !todo.completed);
  const hasActiveTodo = todosList.some(todo => todo.completed);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodosList)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  function deletePost(postId: number): Promise<void> {
    setLoadingTodo(prev => [...prev, postId]);

    return deleteTodo(postId)
      .then(() => {
        setIsLoading(true);
        setTodosList(todos => todos.filter(todo => todo.id !== postId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setLoadingTodo(prev => prev.filter(id => id !== postId));
        inputRef.current?.focus();
      });
  }

  const deleteCompletedTasks = () => {
    const completedTodos = todosList.filter(todo => todo.completed);

    setLoadingTodo(completedTodos.map(todo => todo.id));

    Promise.all(completedTodos.map(todo => deletePost(todo.id))).finally(() => {
      setLoadingTodo([]);
    });
  };

  const addPost = async (newTodo: Omit<Todo, 'id'>): Promise<void> => {
    const todo = { ...newTodo, id: 0 };

    setTempTodo(todo);

    try {
      const addedTodo = await addTodo(newTodo);

      setTodosList(currentTodos => [...currentTodos, addedTodo]);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const filteredList = () => {
    switch (filter) {
      case TypeFilter.Active:
        return todosList.filter(todo => !todo.completed);
      case TypeFilter.Completed:
        return todosList.filter(todo => todo.completed);
      default:
        return todosList;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addPost={addPost}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredList()}
          deletePost={deletePost}
          loadingTodo={loadingTodo}
        />

        {tempTodo && <TempTodo todo={tempTodo} loadingTodo={loadingTodo} />}

        {/* Hide the footer if there are no todos */}
        {!!todosList.length && (
          <TodoFooter
            setFilter={setFilter}
            filter={filter}
            listOfActiveTodos={listOfActiveTodos.length}
            hasActiveTodo={hasActiveTodo}
            deleteCompletedTasks={deleteCompletedTasks}
            inputRef={inputRef}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
