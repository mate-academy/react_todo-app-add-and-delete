/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { TodoCreate } from './components/TodoCreate/TodoCreate';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { filterTodos } from './utils/filterTodos';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NO_ERROR);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const sendError = (error: ErrorType) => {
    setErrorType(error);

    const timer = setTimeout(() => {
      setErrorType(ErrorType.NO_ERROR);

      clearTimeout(timer);
    }, 3000);
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await todoServices.getTodos();

        setTodoList(todos);
      } catch {
        sendError(ErrorType.LOAD_TODOS);
      }
    };

    getTodos();
  }, []);

  const filteredTodos = filterTodos(statusFilter, todoList);
  const activeTodosCount = todoList.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todoList.length > activeTodosCount;

  const handleClearCompleted = async () => {
    const completedTodos = todoList.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        await todoServices.deleteTodo(todo.id);
        setTodoList(currentTodoList =>
          currentTodoList.filter(currentTodo => currentTodo.id !== todo.id),
        );
      } catch (error) {
        setErrorType(ErrorType.DELETE_TODO);
      }
    }
  };

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoCreate
          setTodoList={setTodoList}
          sendError={sendError}
          userId={todoServices.USER_ID}
          setTempTodo={setTempTodo}
          todoList={todoList}
        />

        {!!todoList.length && (
          <>
            <TodoList
              todoList={filteredTodos}
              tempTodo={tempTodo}
              sendError={sendError}
              setTodoList={setTodoList}
            />
            <TodoFooter
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              countActiveTodos={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              clearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification errorType={errorType} setErrorType={setErrorType} />
    </div>
  );
};
