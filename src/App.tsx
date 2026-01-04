/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import * as todoService from './api/todos';
//import { getTodos, createTodo, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

//const USER_ID = 3806; //изначально 0

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false); //Прямо сейчас идёт запрос на добавление нового тодо
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]); //доп стейт чтобы занть какие сейчас удаляются тодо

  // helpers
  const showMessage = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // derived data
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  //const hasTodos = todos.length > 0;

  //  handlers
  const handleAddTodo = (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showMessage('Title should not be empty');

      return Promise.reject();
    }

    setLoading(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    return todoService
      .createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
      })
      .catch(() => {
        showMessage('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const allCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: !allCompleted,
      })),
    );
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setDeletingTodoIds(prev => [...prev, todo.id]);

      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id)); //Оставь t,если t.id НЕ равен удаляемому тодо»
        }) //удалили из сервера
        .catch(() => {
          showMessage('Unable to delete a todo');
        })
        .finally(() => {
          setDeletingTodoIds(prev => prev.filter(id => id !== todo.id)); //в процессе удаления
          // также надо убрать
        }); //остав только тот айди которое не равен удаляемому
    });
  };

  const handleCloseError = () => {
    setError('');
  };

  //render
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          isAdding={loading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            onDeleteTodo={handleDeleteTodo}
          />
        </section>

        <Footer
          activeTodos={activeTodos}
          completedTodos={hasCompletedTodos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <Notification message={error} onClose={handleCloseError} />
    </div>
  );
};
