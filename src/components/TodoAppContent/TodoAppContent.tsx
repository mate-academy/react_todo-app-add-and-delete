import React, { useState, useEffect, useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos, addTodo, deleteTodo } from '../../api/todos';
import { useAuth } from '../../Context/Context';
import { Input } from '../Input';
import { TodoItem } from '../TodoItem';
import { Filter } from '../Filter';
import { filteredData } from '../../helpers/filteredData';
import { FilterBy, ErrorMessage } from '../../types/types';
import { Error } from '../Error';

export const TodoAppContent: React.FC = () => {
  const userId = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosCount, setTodosCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [disabledClear, setDisabledClear] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const currentTodos = filteredData<Todo>(todos, filterBy);

  const countOfNotCompleted = (arr: Todo[]): number => {
    return arr.filter(({ completed }) => !completed).length;
  };

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then((resp) => {
          setTodos(resp);
          setTodosCount(countOfNotCompleted(resp));
        })
        .catch(() => setErrorMessage(ErrorMessage.Load));
    }
  }, [userId]);

  useMemo(() => {
    setDisabledClear(!todos.some(({ completed }) => completed));
  }, [todos]);

  const handleAddTodo = async (newTodo: string): Promise<string> => {
    let fetchStatus = '';

    if (userId) {
      if (newTodo.trim().length) {
        const body = {
          id: 0,
          title: newTodo,
          userId,
          completed: false,
        };

        setTempTodo(body);

        await addTodo(body)
          .then(resp => {
            setTodos(prev => [...prev, resp]);
            setTodosCount(prev => prev + 1);
            fetchStatus = 'fullfield';
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.Add);
            fetchStatus = 'error';
          })
          .finally(() => {
            setTempTodo(null);
          });
      } else {
        setErrorMessage(ErrorMessage.NotBeEmpty);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fetchStatus);
      }, 250);
    });
  };

  const handleDeleteTodo = (idToDel: number, doNotCount = false) => {
    deleteTodo(idToDel)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== idToDel));
        if (!doNotCount) {
          setTodosCount(prev => prev - 1);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        handleDeleteTodo(id, true);
      }
    });
  };

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <Input
            onSubmit={handleAddTodo}
          />
        </header>

        {currentTodos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {currentTodos.map(todo => (
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  key={todo.id}
                />
              ))}

              {tempTodo && <TodoItem todo={tempTodo} isLoading />}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${todosCount} items left`}
              </span>

              <Filter getFilter={setFilterBy} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={disabledClear}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
};
