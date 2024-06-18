import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/header/Header';
import { TodoList } from './components/todoList/TodoList';
import { Footer } from './components/footer/Footer';
import { Errors } from './components/errors/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        switch (status) {
          case 'all':
            setTodos(todosFromServer);
            break;
          case 'active':
            setTodos(
              todosFromServer.filter(todoStatus => !todoStatus.completed),
            );
            break;
          case 'completed':
            setTodos(
              todosFromServer.filter(todoStatus => todoStatus.completed),
            );
            break;
          default:
            setTodos(todosFromServer);
        }
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, [status]);

  const leftItems = todos.filter(todoStatus => !todoStatus.completed).length;

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage('');
        throw error;
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && (
          <TodoList
            todos={todos}
            onDeleteTodo={handleDeleteTodo}
            handleToggleTodo={}
          />
        )}
        <Footer onClick={setStatus} status={status} items={leftItems} />
      </div>

      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};

//
