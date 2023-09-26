/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Error } from './components/TodoError';
import { Footer } from './components/TodoFooter';
import { TodoList } from './components/TodoList';

const USER_ID = 11578;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Active' | 'Completed'>(
    'All',
  );
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [TodoItem, setTodoItem] = useState<Todo | null>(null);
  const [currentTodoLoading, setCurrentTodoLoading] = useState<number | null>(
    null,
  );

  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  const handleErrorMessage = (message: string | null) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodoItem({ ...newTodo, id: 0 });

    if (trimmedTitle === '') {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    try {
      const createdTodo = await postTodo(newTodo);

      setTodos([...todos, createdTodo]);
      setNewTitle('');
    } catch (e) {
      handleErrorMessage('Unable to add a todo');
    } finally {
      setTodoItem(null);
      setIsLoading(false);
      if (newTodoInputRef.current) {
        setTimeout(() => {
          newTodoInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    setIsLoading(true);
    setCurrentTodoLoading(todo.id);

    try {
      await deleteTodo(todo.id);

      setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id));
    } catch (err) {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      if (newTodoInputRef.current) {
        setTimeout(() => {
          newTodoInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);
      // eslint-disable-next-line
      for (const todo of completedTodos) {
        try {
          // eslint-disable-next-line
          await deleteTodo(todo.id);
          setTodos(prevTodos => prevTodos.filter(v => v.id !== todo.id));
        } catch (err) {
          handleErrorMessage('Unable to delete a todo');
        }
      }
    } catch (err) {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setCurrentTodoLoading(null);
      if (newTodoInputRef.current) {
        setTimeout(() => {
          newTodoInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    const updatedTodos = todos.map(v => (
      v.id === todo.id ? { ...v, completed: !v.completed } : v));

    setTodos(updatedTodos);
  };

  const changeFilterStatus = (type: 'All' | 'Active' | 'Completed') => {
    setFilterType(type);
  };

  useEffect(() => {
    setError(null);
    if (USER_ID) {
      getTodos(USER_ID)
        .then(data => {
          setTodos(data);
        })
        .catch(() => {
          handleErrorMessage('Unable to load todos');
        });
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddTodo(newTitle);
            }}
          >
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              disabled={isLoading}
              onChange={e => setNewTitle(e.target.value)}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filterType={filterType}
              todoItem={TodoItem}
              currentTodoLoading={currentTodoLoading}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleComplete={handleToggleComplete}
            />

            <Footer
              todos={todos}
              filterType={filterType}
              changeFilterStatus={changeFilterStatus}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
