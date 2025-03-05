/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoFilter } from './types/FilterEnum';

export const App: React.FC = () => {
  const [creatNewTodos, setCreateNewTodos] = useState('');
  const [todoItem, setTodoItem] = useState<Todo[]>([]);
  const [errorState, setStateError] = useState('');
  const userId = todosService.USER_ID;
  const [controlChecked, setControlChecked] = useState<number[]>([]);
  const [filter, setFilter] = useState(TodoFilter.All);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingNewItem, setLoadingNewItem] = useState(false);
  const [arrTodos, setArrTodos] = useState<number[]>([]);
  const [delLoader, setDelLoader] = useState<number | null>(null);
  const [activeTodosCount, setActiveTodosCount] = useState(0);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodoItem)
      .catch(() => setStateError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorState) {
      const timer = setTimeout(() => {
        setStateError(''); // Clear the error message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Clean up timer if component unmounts
    }
  }, [errorState]);


  const getFilteredTodos = () => {
    if (filter === TodoFilter.Active) {
      return todoItem.filter(todo => !todo.completed);
    }

    if (filter === TodoFilter.Completed) {
      return todoItem.filter(todo => todo.completed);
    }

    return todoItem;
  };

  const filteredTodos = getFilteredTodos();

  useEffect(() => {
    const activeCount = todoItem.filter(todo => !todo.completed).length;

    setActiveTodosCount(activeCount);
  }, [todoItem]); // Слідкуємо за змінами в todoItem



  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (creatNewTodos.trim() === '') {
      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId,
      title: creatNewTodos,
      completed: false,
    };

    const tempTodoItem = { ...newTodo, id: Date.now() };

    // Спочатку додаємо новий todo без оновлення activeTodosCount
    setTodoItem(prev => [...prev, tempTodoItem]);
    setArrTodos(prevItem => [...prevItem, tempTodoItem.id]);
    setLoadingNewItem(true);

    todosService
      .createPost(newTodo)
      .then(createdTodo => {
        setTodoItem(prev =>
          prev.map(todo => (todo.id === tempTodoItem.id ? createdTodo : todo)),
        );
        setCreateNewTodos('');
        setArrTodos(prevItem =>
          prevItem.map(id => (id === tempTodoItem.id ? createdTodo.id : id)),
        );
      })
      .catch(() => {
        setStateError('Unable to add a todo');
      })
      .finally(() => {
        // Лічильник оновлюється лише після того, як todo створене
        setLoadingNewItem(false);
        setTimeout(() => {
          setArrTodos([]); // Очищаємо тимчасовий масив через 1 секунду
        }, 1000);
      });
  };

  const forClearCompleted = () => {
    const completedTodo = todoItem.filter(todo => todo.completed);
    const completedIds = completedTodo.map(todo => todo.id);

    setTodoItem(prev => prev.filter(todo => !completedIds.includes(todo.id)));

    completedIds.forEach(id => {
      todosService.deleteTodos(id).catch(() => {
        setTimeout(() => setStateError(''), 3000);
      });
    });
  };

  const errorGetTodos = () => {
    setStateError('');

    if (creatNewTodos.trim() === '') {
      setStateError('Title should not be empty');
      setTimeout(() => {
        setStateError('');
      }, 3000);

      return;
    }
  };

  const handleTodoDelete = (usersId: number) => {
    setArrTodos(prevItem => prevItem.filter(id => id !== usersId));
    setDelLoader(userId);
    todosService
      .deleteTodos(usersId)
      .then(() => {
        setTodoItem(prevTodos => prevTodos.filter(todo => todo.id !== usersId));
        setDelLoader(usersId);
      })
      .catch(() => {
        setStateError('Unable to delete a todo ');
        setTimeout(() => setStateError(''), 3000);
      })
      .finally(() => {
        setTimeout(() => {
          setDelLoader(null);
          setArrTodos(prev => prev.filter(id => id !== usersId));
        }, 1000);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatedPost = (updatedPosts: Todo) => {
    todosService
      .updatePost(updatedPosts)
      .then(post => {
        setTodoItem(currentPost => {
          const newPost = [...currentPost];
          const index = newPost.findIndex(item => item.id === updatedPosts.id);

          newPost.splice(index, 1, post);

          return newPost;
        });
      })
      .catch(() => {
        setStateError('Unable to update a todo');
        setTimeout(() => setStateError(''), 3000);
      });
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleForm={handleForm}
          errorGetTodos={errorGetTodos}
          setCreateNewTodos={setCreateNewTodos}
          createNewTodos={creatNewTodos}
          inputRef={inputRef}
          loadingNewItem={loadingNewItem}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            tempTodo={null}
            controlChecked={controlChecked}
            setControlChecked={setControlChecked}
            setTodoItem={setTodoItem}
            handleTodoDelete={handleTodoDelete}
            arrTodos={arrTodos}
            delLoader={delLoader}
          />
        </section>

        {todoItem.length > 0 && (
          <Footer
            todoItem={todoItem}
            filter={filter}
            setFilter={setFilter}
            forClearCompleted={forClearCompleted}
            activeTodosCount={activeTodosCount}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            'hidden': !errorState,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setStateError('')}
        />
        {errorState}
      </div>
    </div>
  );
};
