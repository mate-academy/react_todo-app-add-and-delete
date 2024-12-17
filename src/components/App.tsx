/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from '../UserWarning';
import { USER_ID } from '../api/todos';
import { ErrorNotification } from '../components/ErrorNotification';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { Footer } from '../components/Footer';

import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);


  const handleError = (errorType: string) => {
    switch (errorType) {
      case 'load':
        setError('Unable to load todos');
        break;
      case 'add':
        setError('Unable to add a todo');
        break;
      case 'delete':
        setError('Unable to delete a todo');
        break;
      case 'update':
        setError('Unable to update a todo');
        break;
      default:
        setError('An unknown error occured');
    }
    setIsErrorVisible(true);
  };

  const deleteTodo = (todoId: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isLoading: true } : todo
      )
    );

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== todoId)
        );

        inputRef.current?.focus();
      })
      .catch(() => {
        handleError('delete');
        setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo.id === todoId ? { ...todo, isLoading: false } : todo
          )
        );
      });
  }

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    if (!title.trim()) {
      setError('Title should not be empty');
      setIsErrorVisible(true);
      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      title,
      userId,
      completed,
    };

    setTempTodo(temporaryTodo);
    setIsAdding(true);

    todoService
      .createTodo({ title: title.trim(), userId, completed })
      .then((newTodo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('add');
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
        inputRef.current?.focus();
      });
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    Promise.allSettled(
      completedTodos.map((todo) => todoService.deleteTodo(todo.id))
    ).then((results) => {

      const failedIds = results
        .map((result, index) =>
          result.status === 'rejected' ? completedTodos[index].id : null
        )
        .filter((id): id is number => id !== null);

      setTodos((currentTodos) =>
        currentTodos.filter(
          (todo) => !todo.completed || failedIds.includes(todo.id)
        )
      );

      if (results.some((result) => result.status === 'rejected')) {
        handleError('delete');
      }
    });
  };


  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await todoService.getTodos();
        setTodos(todosData);
        setError(null);
      } catch (err) {
        handleError('load');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={(title) => addTodo({ title, userId: USER_ID, completed: false })} isAdding={isAdding} newTodoTitle={newTodoTitle} setNewTodoTitle={setNewTodoTitle} inputRef={inputRef}/>
        <TodoList todos={todos} tempTodo={tempTodo} setTodos={setTodos} filter={filter} onDelete={deleteTodo}/>
        {todos.length > 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} clearCompletedTodos={clearCompletedTodos}/>
        )}
      </div>
      <ErrorNotification
        error={isErrorVisible ? error : null}
        onClose={() => {
          setIsErrorVisible(false);
          setError(null);
        }}
      />
    </div>
  );
};
