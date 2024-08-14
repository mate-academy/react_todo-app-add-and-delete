/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(0);
  const [deleteTodoId, setDeleteTodoId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const field = useRef<HTMLInputElement>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (field.current) {
      field.current.disabled = true;
    }

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {
        if (field.current) {
          field.current.disabled = false;
          field.current.focus();
        }
      });
  }, []);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [editingTodoId]);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case TodoStatus.active:
        return !todo.completed;
      case TodoStatus.completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const activeItems = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteTodo = (todoId: number) => {
    setDeleteTodoId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        if (field.current) {
          field.current.focus();
        }
      });
  };

  const handleCompleteDelete = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const addTodo = (title: string) => {
    const titleWithOutSpaces = title.trim();

    if (titleWithOutSpaces.length === 0) {
      handleError('Title should not be empty');

      return;
    }

    const currentTodo = {
      id: 0,
      title: titleWithOutSpaces,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo(currentTodo);

    if (field.current) {
      field.current.disabled = true;
    }

    todoService
      .createTodo(currentTodo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        handleError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        if (field.current) {
          field.current.disabled = false;
          field.current.focus();
        }
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          field={field}
          title={todoTitle}
          addTodo={addTodo}
          onChange={setTodoTitle}
        />

        <TodoList
          tempTitle={todoTitle}
          field={field}
          todoList={visibleTodos}
          tempTodo={tempTodo}
          editTodo={editingTodoId}
          deleteTodo={deleteTodoId}
          onEdit={setEditingTodoId}
          onDelete={deleteTodo}
        />

        {todos.length && (
          <Footer
            status={status}
            activeItems={activeItems}
            complitedItems={completedTodos}
            onClick={setStatus}
            onDelete={handleCompleteDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
