/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import * as todosService from './utils/todos';
import { NotificationText, SortCondition } from './types/enums';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Header } from './components/Header/Header';
import { USER_ID } from './utils/user';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[] | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [filterBy, setFilterBy] = useState(SortCondition.All);
  const [activeItemsCount, setActiveItemsCount] = useState(0);
  const [completedItemsCount, setCompletedItemsCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  // #region Notifications
  const [
    notificationMessage,
    setNotificationMessage,
  ] = useState<NotificationText | null>(null);

  function showNotification(text: NotificationText) {
    setNotificationMessage(text);

    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  }
  // #endregion

  // #region Add/Delete/Update dunctions
  function addTodoToTheTodoList(newTodo: Todo) {
    setActiveItemsCount(current => current + 1);
    setTodosFromServer(currentTodos => {
      return currentTodos ? [...currentTodos, newTodo] : [newTodo];
    });
  }

  // #region Delete
  const deleteTodoFromTodoList = (todoToDevelte: Todo) => {
    const { id, completed } = todoToDevelte;

    setTodosFromServer(currentTodos => {
      return currentTodos?.filter(todo => todo.id !== id) || null;
    });

    if (completed) {
      setCompletedItemsCount(current => current - 1);
    } else {
      setActiveItemsCount(current => current - 1);
    }
  };

  function deleteTodo(todo: Todo) {
    setTodosInProcess(current => [...current, todo.id]);

    todosService.deleteTodo(todo.id)
      .then(() => {
        deleteTodoFromTodoList(todo);
      })
      .catch((error) => {
        setNotificationMessage(NotificationText.Delete);
        throw error;
      })
      .finally(() => {
        setTodosInProcess(current => current.filter(id => id !== todo.id));
      });
  }

  function deleteCompletedTodos() {
    const completedTodos = todosFromServer?.filter(todo => todo.completed);

    completedTodos?.forEach(todo => deleteTodo(todo));
  }
  // #endregion

  // #endregion

  // #region Filter Todos
  function filterTodos(allTodos: Todo[]) {
    let filteredTodos = allTodos;
    const activeTodos = filteredTodos.filter(todo => !todo.completed);
    const completedTodos = filteredTodos.filter(todo => todo.completed);

    if (filterBy === SortCondition.Active) {
      filteredTodos = activeTodos;
    } else if (filterBy === SortCondition.Completed) {
      filteredTodos = completedTodos;
    }

    setCompletedItemsCount(completedTodos.length);
    setActiveItemsCount(activeTodos.length);
    setVisibleTodos(filteredTodos);
  }

  useEffect(() => {
    if (todosFromServer) {
      filterTodos(todosFromServer);
    }
  }, [todosFromServer, filterBy]);
  // #endregion

  useEffect(() => {
    setNotificationMessage(null);

    todosService.getTodos()
      .then(setTodosFromServer)
      .catch((error) => {
        showNotification(NotificationText.Get);
        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          showError={(error) => showNotification(error)}
          setNewTodo={(newTodo) => addTodoToTheTodoList(newTodo)}
          setTempTodo={setTempTodo}
        />

        {visibleTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              todosInProcess={todosInProcess}
              deleteTodo={(todo) => deleteTodo(todo)}
            />

            <Footer
              filterCondition={filterBy}
              visibleItemsCount={activeItemsCount}
              isCompletedTodos={completedItemsCount > 0}
              setFilterCOndition={setFilterBy}
              clearCompleted={() => deleteCompletedTodos()}
            />
          </>
        )}
      </div>

      {notificationMessage && (
        <Notification
          text={notificationMessage}
          hideNotification={() => setNotificationMessage(null)}
        />
      )}
    </div>
  );
};
