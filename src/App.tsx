/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrors } from './components/TodoErrors';
import { Todo } from './types/Todo';
import * as TodoService from './api/todos';
import { FilteredBy } from './types/FilteredBy';
import { getFilteredTodos } from './utils/filter';
import { todosForDelete } from './utils/todosForDelete';
import { USER_ID } from './utils/UserId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState(FilteredBy.ALL);
  const [isLoading, setLoading] = useState(false);
  const [listOfTodosIds, setListOfTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      }).catch(() => setError('Wrong URL - could not make a request'));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodosLength = useMemo(() => {
    return filteredTodos
      .filter(filteredTodo => !filteredTodo.completed).length;
  }, [filteredTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    TodoService.deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setListOfTodosIds([]);
      });
  };

  const deleteCompletedTodos = () => {
    setLoading(true);

    const completedTodos = todosForDelete(todos);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setListOfTodosIds(completedTodoIds);

    if (!completedTodos || completedTodos.length === 0) {
      setError('There are no completed todos');
      setLoading(false);

      return;
    }

    completedTodos.map(todo => deleteTodo(todo.id));
  };

  const addTodo = (newTodo: Todo) => {
    setLoading(true);
    setTempTodo(newTodo);

    TodoService.createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => {
        setError('Unable to add a post');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              classNames('todoapp__toggle-all', {
                active: activeTodosLength !== 0,
              })
            }
          />
          <TodoForm
            loading={isLoading}
            todos={filteredTodos}
            addTodo={(newTodo) => addTodo(newTodo)}
          />
        </header>

        {
          todos.length !== 0
          && (
            <>
              <TodoMain
                deleteTodo={deleteTodo}
                todos={filteredTodos}
                isLoading={isLoading}
                listOfTodosIds={listOfTodosIds}
                tempTodo={tempTodo}
              />
              <TodoFooter
                todos={todos}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            </>
          )
        }
      </div>

      {error.length !== 0
        && <TodoErrors error={error} />}
    </div>
  );
};
