import { useEffect, useState } from 'react';

import { Todo } from '../types/Todo';
import { Notification } from '../types/Notification';
import { Status } from '../types/Status';

import * as TodosService from '../api/todos';

import { UserWarning } from '../UserWarning';
import { TodoFooter } from './TodoFoter';
import { TodoList } from './TodoList';
import { TodoNotificaition } from './TodoNotification';
import { TodoHeader } from './TodoHeader';
import { getVisibleTodos } from '../service/filter';

const USER_ID = 11293;

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    TodosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Notification.load);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const addTodo = ({ title, userId, completed }: Todo) => {
    setErrorMessage('');

    return TodosService.createTodos({ title, userId, completed })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
      })
      .catch((error) => {
        setErrorMessage(Notification.add);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    TodosService.deletePost(todoId);
    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = getVisibleTodos(todos, status);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          userId={USER_ID}
          onSubmit={addTodo}
          onChangeError={setErrorMessage}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={deleteTodo}
            />

            <TodoFooter
              onChangeFilter={setStatus}
              filteredSelected={status}
              todos={todos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <TodoNotificaition
          errorMessage={errorMessage}
          setClose={setErrorMessage}
        />
      )}
    </div>
  );
};
