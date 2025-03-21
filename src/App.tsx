/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTodo } from './types/FilterTodo';
import { Todo } from './types/Todo';
import * as api from './api/todos';

export const App: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtered, setFiltered] = useState<FilterTodo>('All');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  useEffect(() => {
    setLoading(true);

    api
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filtered) {
      case 'Active':
        filteredTodos = filteredTodos.filter(td => !td.completed);
        break;
      case 'Completed':
        filteredTodos = filteredTodos.filter(td => td.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [filtered, todos]);

  const changeVisibleTodos = (el: FilterTodo) => {
    setFiltered(el);
  };

  async function addTodo(title: string) {
    setAdding(true);
    setErrorMsg('');
    setTempTodo({ id: 0, title, completed: false, userId: api.USER_ID });

    try {
      if (title.trim().length === 0) {
        setErrorMsg('Title should not be empty');
        setAdding(false);

        return;
      }

      const newTodo = await api.addTodo({
        title,
        completed: false,
        userId: api.USER_ID,
      });

      setTodos(prevTodos => {
        return [...prevTodos, newTodo];
      });
    } catch {
      setErrorMsg('Unable to add a todo');
    } finally {
      setAdding(false);
      setTempTodo(null);
    }
  }

  /* async function updateTodo(todoToUpdate: Todo) {
    try {
      const updatedTodo = await api.updateTodo(todoToUpdate);

      setTodos(prevTodos => {
        return prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });
    } catch (e) {
      setErrorMsg('Unable to update a todo');
      throw e;
    }
  } */

  async function deleteTodo(todosId: number[]) {
    setDeletedIds(todosId);

    for (const tododId of todosId) {
      try {
        await api.deleteTodo(tododId);

        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== tododId);
        });
      } catch {
        setErrorMsg('Unable to delete a todo');
      } finally {
        setDeletedIds([]);
      }
    }
  }

  if (!api.USER_ID) {
    return <UserWarning />;
  }

  const changeError = (er: string) => {
    setErrorMsg(er);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          adding={adding}
          errorMsg={errorMsg}
          todos={todos}
        />
        {!loading && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            deletedIds={deletedIds}
            tempTodo={tempTodo}
            adding={adding}
          />
        )}
        {todos.length > 0 && (
          <Footer
            changeVisibleTodos={changeVisibleTodos}
            filtered={filtered}
            todos={todos}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMsg} changeError={changeError} />
    </div>
  );
};
