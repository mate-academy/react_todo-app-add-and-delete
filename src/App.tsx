import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServise from './api/todos';

import { Todo } from './types/Todo';
import { TodoList } from './component/TodoList/TodoList';
import { Headers } from './component/Headers/Headers';
import { Footer } from './component/Footer/Footer';
import { timerClierErrorMessege } from './utils/fetchClient';
import { ErrorType } from './types/errorType';
import { FilterType } from './types/filterType';
import { ErrorMessage } from './component/ErrorMessege/ErrorMessage';

function filteredTodos(todos: Todo[], filter: string) {
  switch (filter) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stateTodo, setStateTodo] = useState('');
  const [serverLoading, setServerLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState<Todo | null>(null);
  const [todoDelete, setTodoDelete] = useState<boolean>(false);
  const [clearStatys, setClearStatys] = useState(false);

  const todoCompleteList = filteredTodos(todoList, stateTodo);

  const completedAll = todoList.every(todo => todo.completed);
  const hasCompletedTodo = todoCompleteList.some(todo => todo.completed);
  const itemLeft = todoList.filter(todo => todo.completed === false).length;

  useEffect(() => {
    todoServise
      .getTodos()
      .then(setTodoList)
      .catch(error => {
        setErrorMessage(ErrorType.Load);
        throw error;
      })
      .finally(() => timerClierErrorMessege(setErrorMessage));
  }, []);

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (title.trim().length === 0) {
      setErrorMessage(ErrorType.Title);
      timerClierErrorMessege(setErrorMessage);

      return;
    }

    setServerLoading(true);

    setLoadingItem({
      id: 0,
      userId: todoServise.USER_ID,
      title: title,
      completed: false,
    });

    todoServise
      .addTodos(title.trim())
      .then(todo => {
        setTodoList(currentList => [...currentList, todo]);
        setLoadingItem(null);
        setTitle('');
      })
      .catch(eroor => {
        setErrorMessage(ErrorType.Add);
        throw eroor;
      })
      .finally(() => {
        timerClierErrorMessege(setErrorMessage);
        setServerLoading(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodoDelete(true);

    return todoServise
      .deleteTodos(todoId)
      .then(() => {
        setTodoList(currentTodoList =>
          currentTodoList.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setTodoList(currentList => [...currentList]);
        setErrorMessage(ErrorType.Delete);
        timerClierErrorMessege(setErrorMessage);
        throw error;
      })
      .finally(() => setTodoDelete(false));
  };

  const handleCompletedAll = () => {
    setTodoList(currentTodo =>
      currentTodo.map(todo => ({
        ...todo,
        completed: !completedAll,
      })),
    );

    todoList.map(todo =>
      todoServise.patchTodos(todo.id, { completed: !completedAll }),
    );
  };

  const handleCompleted = (todoId: number) => {
    setTodoList(currentTodo =>
      currentTodo.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    const todoUpdete = todoList.find(todo => todo.id === todoId);

    if (todoUpdete) {
      return todoServise.patchTodos(todoId, {
        completed: !todoUpdete.completed,
      });
    }
  };

  const clearComplete = () => {
    setClearStatys(true);

    const completedTodos = todoList.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        todoServise.deleteTodos(todo.id).then(() => todo.id),
      ),
    ).then(rezults => {
      const successIds = rezults
        .filter(rezult => rezult.status === 'fulfilled')
        .map(rezult => (rezult as PromiseFulfilledResult<number>).value);

      setTodoList(currentList =>
        currentList.filter(todo => !successIds.includes(todo.id)),
      );

      if (successIds.length < completedTodos.length) {
        setErrorMessage(ErrorType.Delete);
        timerClierErrorMessege(setErrorMessage);
      }

      setClearStatys(false);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Headers
          handleCompletedAll={handleCompletedAll}
          setTitle={value => setTitle(value)}
          handleSubmit={handleSubmit}
          todoCompleteList={todoCompleteList}
          completedAll={completedAll}
          serverLoading={serverLoading}
          title={title}
        />

        {todoList.length > 0 && (
          <>
            <TodoList
              deleteTodos={deleteTodo}
              completed={handleCompleted}
              clearTodoComplete={clearStatys}
              todoDelete={todoDelete}
              todoList={todoCompleteList}
              loading={serverLoading}
              tempTodo={loadingItem}
            />

            <Footer
              itemLeft={itemLeft}
              stateTodo={stateTodo}
              setStateTodo={state => setStateTodo(state)}
              clearComplete={clearComplete}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}
      </div>
      <ErrorMessage message={errorMessage} />
    </div>
  );
};
