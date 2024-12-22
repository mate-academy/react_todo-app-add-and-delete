/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getCompletedTodos, pause } from './utils/methods';
import { TodoList } from './components/TodoList';
import { FILTER_BY } from './constants/constants';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MyError } from './components/MyError';

function filterTodos(todos: Todo[], filterBy: string) {
  const copy = [...todos];

  switch (filterBy) {
    case FILTER_BY.ALL:
      return copy;
    case FILTER_BY.ACTIVE:
      return copy.filter(e => !e.completed);
    case FILTER_BY.COMPLETED:
      return copy.filter(e => e.completed);
  }

  return [];
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(FILTER_BY.ALL);
  const [loader, setLoader] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [massLoader, setMassLoader] = useState(false);
  const filteredTodos = filterTodos(todos, filterBy);

  useEffect(() => {
    setTimeout(() => {
      getTodos()
        .then(todosFromServer => {
          setTodos(todosFromServer);
        })
        .catch(() => setErrorMessage('Unable to load todos'));
    }, 200);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const sizeItemsLeft = () => todos.length - getCompletedTodos(todos).length;

  const handleUpdateCompleted = async (todo: Todo) => {
    const updatedTodo = {
      id: todo.id,
      completed: todo.completed,
    };

    try {
      setLoader(true);
      await pause();
      const newTodo = await updateTodo(updatedTodo);

      setTodos(prev => {
        return prev.map(e => (e.id === newTodo.id ? { ...e, ...newTodo } : e));
      });
    } catch {
      setErrorMessage('Unable to update todo');
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoader(true);

    try {
      await pause();
      await deleteTodo(id);
      setTodos(prev => prev.filter(e => e.id !== id));
    } finally {
      setLoader(false);
    }
  };

  const clearCompleted = async () => {
    setMassLoader(true);
    const completedTodos = getCompletedTodos(todos);
    const todosToDelete: number[] = [];
    let isError = false;

    try {
      await pause();
      const results = await Promise.allSettled(
        completedTodos.map(e => deleteTodo(e.id)),
      );

      results.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          todosToDelete.push(completedTodos[i].id);
        } else {
          isError = true;
        }
      });

      if (isError) {
        throw new Error('Unable to delete a todo');
      }

      // const isSuccess = results
      //   .filter(result => result.status === 'fulfilled')
      //   .map((_, index) => completedTodos[index].id);
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTodos(prev => prev.filter(todo => !todosToDelete.includes(todo.id)));
      setMassLoader(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          sizeLeft={sizeItemsLeft()}
          onTodos={setTodos}
          onErrorMessage={setErrorMessage}
          onLoader={setLoader}
          onMassLoader={setMassLoader}
          onTempTodo={setTempTodo}
        />
        {/*List of Todos */}
        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onUpdate={handleUpdateCompleted}
            onDelete={handleDeleteTodo}
            loader={loader}
            massLoader={massLoader}
            tempTodo={tempTodo}
            onErrorMessage={setErrorMessage}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={filterBy}
            sizeLeft={sizeItemsLeft()}
            onFilter={setFilterBy}
            onClear={clearCompleted}
            todos={todos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <MyError errorMessage={errorMessage} onErrorMessage={setErrorMessage} />
    </div>
  );
};
