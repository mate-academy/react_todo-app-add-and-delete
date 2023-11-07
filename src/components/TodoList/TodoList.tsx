import { useEffect, useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { deleteTodo, getTodos, postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Header } from './Header';
import { Footer } from './Footer';
import { TodoItem } from './TodoListElements/TodoItem';
import { FilterType } from '../../types/FilterType';
import { ErrorNotification } from './ErrorNotification';

type Props = {
  userId: number;
};

export const TodoList: React.FC<Props> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filteredTodo, setFilteredTodo] = useState<FilterType>(FilterType.ALL);

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  let updatedTodos = [...todos];

  switch (filteredTodo) {
    case FilterType.ALL:
      updatedTodos = todos.filter(todo => todo);
      break;
    case FilterType.ACTIVE:
      updatedTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterType.COMPLETED:
      updatedTodos = todos.filter(todo => todo.completed);
      break;
    default: updatedTodos = todos;
  }

  const todosQty = todos.filter(todo => todo.completed !== true).length;

  const handleCreateTodoSubmit = (
    todoTitle: string,
    setIsInputDisabled: (value: boolean) => void,
    setTodoTitle: (value: string) => void,
  ) => {
    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title: todoTitle.trim(),
      userId,
      completed: false,
    });

    setIsInputDisabled(true);

    postTodo({
      title: todoTitle.trim(),
      userId,
      completed: false,
    })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setLoading(true);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).map(todo => handleDeleteTodo(todo.id));
  };

  return (
    <>
      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          <Header
            handleCreateTodoSubmit={handleCreateTodoSubmit}
          />
          <TransitionGroup>
            { updatedTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  title={todo.title}
                  key={todo.id}
                  completed={todo.completed}
                  isLoading={loading}
                  id={todo.id}
                  handleDeleteTodo={handleDeleteTodo}
                />
              </CSSTransition>
            ))}

            { tempTodo && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  title={tempTodo.title}
                  key={tempTodo.id}
                  completed={tempTodo.completed}
                  isLoading
                  id={tempTodo.id}
                  handleDeleteTodo={handleDeleteTodo}
                />
              </CSSTransition>
            )}

            { todos.length > 0 && (
              <Footer
                todosQty={todosQty}
                filterTodo={setFilteredTodo}
                selectedTodoFilter={filteredTodo}
                handleClearCompleted={handleClearCompleted}
                hasCompletedTodos={
                  todos.filter(todo => todo.completed).length > 0
                }
              />
            )}
          </TransitionGroup>
        </section>
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>

  );
};
