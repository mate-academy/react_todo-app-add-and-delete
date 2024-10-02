import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/types';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Notifications } from './components/Notifications/Notifications';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputTitle, setInputTitle] = useState('');
  const myId = USER_ID;
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeOutRef = useRef<NodeJS.Timeout | number>(0);

  useEffect(() => {
    if (inputRef.current) {
      if (loading) {
        inputRef.current.disabled = true;
      } else {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    }
  }, [loading]);

  const completedCount = todos.filter(todo => todo.completed).length;

  function close() {
    setErrorMessage('');
  }

  function loadTodos() {
    setLoading(true);
    // setIsErrorVisiable(false);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        // setIsErrorVisiable(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (errorMessage) {
      timeOutRef.current = setTimeout(close, 3000);
    }

    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [errorMessage]);

  useEffect(loadTodos, [myId]);

  function addTodo() {
    setErrorMessage('');
    if (!inputTitle.trim()) {
      setErrorMessage('Title should not be empty');
    }

    if (!inputTitle.trim()) {
      return;
    }

    setLoading(true);

    setTempTodo({
      id: 0,
      userId: 0,
      title: inputTitle,
      completed: false,
    });

    todoService
      .createTodo({ userId: myId, title: inputTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setLoading(false);
        setTempTodo(null);
        setInputTitle('');
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function deleteTodo(todoId: number) {
    setDeletingId(todoId);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setDeletingId(null);
        inputRef.current?.focus();
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setDeletingId(null);
        throw error;
      });
  }

  function deleteTodos(todoIds: number[]) {
    const promices = todoIds.map(todoId => todoService.deleteTodo(todoId));

    return Promise.allSettled(promices).then(results => {
      const errors = results.filter(result => result.status === 'rejected');
      const successIds = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.id);

      return { errors, successIds };
    });
  }

  function deleteCompletedTodos() {
    setLoading(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    deleteTodos(completedTodoIds)
      .then(({ errors, successIds }) => {
        if (errors.length > 0) {
          setErrorMessage('Unable to delete a todo');
        }

        setTodos(currentTodos =>
          currentTodos
            .filter(todo => !successIds.includes(todo.id))
            .filter(todo => !todo.completed),
        );

        setLoading(false);
      })
      .catch(() => {
        setTodos(todos);
        // setErrorMessage('Unable to delete a todo');
        setLoading(false);
      });
  }

  const handleFilter = (currentFilter: string) => {
    setFilter(currentFilter);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;

      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
          deletingId={deletingId}
          tempTodo={tempTodo}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filter={filter}
            handleFilter={handleFilter}
            completedCount={completedCount}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <Notifications errorMessage={errorMessage} />
    </div>
  );
};
