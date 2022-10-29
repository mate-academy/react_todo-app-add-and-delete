import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useLocation } from 'react-router-dom';
import { getTodos, postTodo, deleteTodo } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';
import {
  Notification, TodoList, Footer, Header,
} from './index';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | []>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [textNotification, setTextNotification] = useState<string>('');
  const [
    typeNotification,
    setTypeNotification,
  ] = useState<'error' | 'success'>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>('');
  const [newTodo, setNewTodo] = useState<Todo>();
  const [deleteCompleted, setDeleteCompleted] = useState<boolean>(false);

  const user = useContext(AuthContext);
  const location = useLocation();

  const { pathname } = location;

  const toggleError = (
    state: boolean,
    text: string,
    type: 'error' | 'success',
  ) => {
    setIsNotificationOpen(state);
    setTextNotification(text);
    setTypeNotification(type);
    setTimeout(() => {
      setIsNotificationOpen(true);
    }, 3000);
  };

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  const setNotification = (state: boolean) => {
    setIsNotificationOpen(state);
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newText) {
      toggleError(false, 'Title can\'t be empty', 'error');
    } else {
      setIsAdding(true);

      try {
        if (user) {
          const post = await postTodo(newText, user.id, false);

          setNewTodo(JSON.parse(JSON.stringify(post)));
        }
      } catch (error) {
        toggleError(false, 'Unable to add a todo', 'error');
      }

      setIsAdding(false);
      setNewText('');
    }
  }, [newText]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(visibleTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      toggleError(false, 'Unable to delete a todo', 'error');
    }
  }, [visibleTodos]);

  const timerRemoveTodos = () => {
    setTimeout(() => {
      setDeleteCompleted(false);
      setTodos(visibleTodos.filter(todo => todo.completed === false));
    }, 3000);
  };

  const removeCompletedTodo = () => {
    setDeleteCompleted(true);
    todos.forEach(async todo => {
      if (todo.completed) {
        try {
          await deleteTodo(todo.id);
        } catch (error) {
          setDeleteCompleted(false);
          toggleError(false, 'Unable to delete a todo', 'error');
        }
      }
    });

    timerRemoveTodos();
  };

  useEffect(() => {
    if (newTodo) {
      setTodos((prev) => [...prev, newTodo]);
    }
  }, [newTodo]);

  useEffect(() => {
    switch (pathname) {
      case '/':
        setVisibleTodos(todos);
        break;
      case '/active':
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;
      case '/completed':
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      default:
        break;
    }
  }, [pathname, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          setNewText={setNewText}
          newText={newText}
        />
        {
          todos.length > 0
            && (
              <>
                <section className="todoapp__main" data-cy="TodoList">
                  <TodoList
                    todos={visibleTodos}
                    removeTodo={removeTodo}
                    isAdding={isAdding}
                    newText={newText}
                    deleteCompleted={deleteCompleted}
                  />
                </section>
                <Footer
                  itemsLeft={todos.filter(el => !el.completed).length}
                  itemsCompleted={todos.filter(el => el.completed).length}
                  removeCompletedTodo={removeCompletedTodo}
                />
              </>
            )
        }
      </div>
      <Notification
        text={textNotification}
        type={typeNotification}
        setNotification={setNotification}
        isHidden={isNotificationOpen}
      />
    </div>
  );
};
