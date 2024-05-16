import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Status } from '../enums/Status';
import { deleteTodoItem } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  status: Status;
  tempTodo: Todo | null;
  onError: (error: string) => void;
  mainRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  tempTodo,
  onError,
  mainRef,
}) => {
  const [editValue, setEditValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [isDeleting, mainRef]);

  const toggle = (id: number) => {
    const todosCopy = [...todos];
    const chosenTodoIndex = todosCopy.findIndex(todo => todo.id === id);
    const chosenTodo = todosCopy[chosenTodoIndex];

    if (chosenTodo) {
      if (!chosenTodo.completed) {
        chosenTodo.completed = true;
      } else {
        chosenTodo.completed = false;
      }
    }

    todosCopy.splice(chosenTodoIndex, 1, chosenTodo);

    setTodos(todosCopy);
  };

  const deleteTodo = (id: number) => {
    setIsDeleting(true);

    return deleteTodoItem(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        onError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setTimeout(() => onError(''), 3000);
        setIsDeleting(false);
      });
  };

  const saveTodo = (id: number) => {
    const todosCopy = [...todos];
    const chosenTodo = todosCopy.find(todo => todo.id === id) as Todo;

    if (!editValue) {
      deleteTodo(id);
    } else {
      chosenTodo.title = editValue;
      setTodos(todosCopy);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos
        .filter(todo => {
          if (status === Status.all) {
            return true;
          }

          if (status === Status.active) {
            return !todo.completed;
          }

          if (status === Status.completed) {
            return todo.completed;
          }

          return true;
        })
        .map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onToggle={toggle}
            editValue={editValue}
            setEditValue={setEditValue}
            onSave={saveTodo}
            unique={false}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={deleteTodo}
          onToggle={toggle}
          editValue={editValue}
          setEditValue={setEditValue}
          onSave={saveTodo}
          unique={true}
        />
      )}
    </section>
  );
};
