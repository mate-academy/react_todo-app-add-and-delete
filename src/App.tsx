/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos';
import { Errors } from './components/errors/errors';
import { Footer } from './components/footer/footer';
import { ToDoList } from './components/todoList/todoList';
import { Header } from './components/header/header';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoSatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [idTodo, setIdTodo] = useState(0);
  const [newTodo, setNewTodo] = useState({
    userId: USER_ID,
    title: '',
    completed: false,
  });

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        switch (status) {
          case TodoStatus.Active:
            setTodos(todosFromServer.filter(todo => !todo.completed));
            break;
          case TodoStatus.Completed:
            setTodos(todosFromServer.filter(todo => todo.completed));
            break;

          default:
            setTodos(todosFromServer);
        }
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, [setTodos, status]);

  async function onDeleteTodo(todoId: number) {
    setIdTodo(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => {
        return currentTodos.filter(todo => todo.id !== todoId);
      });
    } catch {
      setTodos(todos);
      setErrorMessage('Unable to delete a todo');
    }
  }

  async function onCreateTodo(newTodos: Omit<Todo, 'id'>) {
    const trimmedTodo = { ...newTodos, title: newTodos.title.trim() };

    setTodos(currentTodos => [...currentTodos, { ...newTodo, id: 0 }]);
    setIdTodo(0);

    try {
      const todo = await createTodo(trimmedTodo);

      setTodos(todos);
      setTodos(currentTodos_1 => [...currentTodos_1, todo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTodos(todos);
      throw error;
    }
  }

  function handleChangeTitle(value: string) {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: value,
    }));
  }

  function reset() {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: '',
    }));
  }

  const leftItemsCount = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;
  const completedItems = todos.filter(todo => todo.completed);

  async function clearCompletedTodo() {
    completedItems.map(async todo => {
      await deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(item => item.id !== todo.id);
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
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
          todo={newTodo}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={setErrorMessage}
        />
        <ToDoList list={todos} onDelete={onDeleteTodo} idTodo={idTodo} />
        {todos.length > 0 && (
          <Footer
            onClick={setStatus}
            status={status}
            leftItems={leftItemsCount}
            completedItems={completedItems}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>
      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
