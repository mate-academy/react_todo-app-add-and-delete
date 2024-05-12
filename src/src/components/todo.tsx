import { useContext, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Todo } from "../types/Todo";
import { TodosContext } from "../services/Store";
import * as todoService from "../api/todos";

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    setLoadErrorMessage,
    setIsHidden,
    allTodosButton,
    setAllTodosButton,
    isSubmiting,
    setIsSubmiting,
    selectedTodoId,
    setSelectedTodoId,
    clearButtonClicked,
  } = useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const inputField = useRef<HTMLInputElement>(null);

  const initialTitle = todo.title;

  const activeTodos = todos.every((todoItem) => todoItem.completed);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  });

  const onSelected = (id: number) => {
    setSelectedTodoId(id);
    setIsSubmiting(true);

    const copiedTodos = [...todos];

    copiedTodos.map((todoItem) => {
      const todoElem = todoItem;

      if (todoElem.id === id) {
        todoElem.completed = !todoElem.completed;
      }

      return todoElem;
    });

    setTodos(copiedTodos);

    setTimeout(() => {
      setSelectedTodoId(null);
      setIsSubmiting(false);
    }, 100); //temp
  };

  const onDelete = (id: number) => {
    const newTodos = todos.filter((todoItem) => todoItem.id !== id);

    setIsSubmiting(true);
    setSelectedTodoId(id);

    return todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(newTodos);
      })
      .catch((error) => {
        setIsHidden(false);
        setLoadErrorMessage("Unable to delete a todo");
        throw error;
      })
      .finally(() => {
        setTimeout(() => {
          setIsHidden(true);
          setLoadErrorMessage("");
        }, 3000);
        setIsSubmiting(false);
        setSelectedTodoId(null);
      });
  };

  const handleEscapeKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditing(false);
      setTodoTitle(initialTitle);
    }
  };

  const handleBlur = () => {
    if (!todoTitle.length) {
      onDelete(todo.id);
    } else {
      setIsEditing(false);
    }
  };

  const onChangeHandler = () => {
    onSelected(todo.id);
    if (allTodosButton || activeTodos) {
      setAllTodosButton(true);
    }
  };

  const buttonOnClichHandler = () => {
    onDelete(todo.id);
  };

  const completedTodoIds = [...todos]
    .filter((todoItem) => todoItem.completed)
    .map((todoItem) => todoItem.id);

  return (
    <div
      data-cy="Todo"
      className={cn("todo", {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <p style={{ display: "none" }}>hidden text</p>

        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onChangeHandler}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={inputField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            onDoubleClick={() => setIsEditing(!isEditing)}
            onBlur={handleBlur}
            onKeyUp={handleEscapeKey}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(!isEditing)}
            onClick={() => onSelected(todo.id)}
          >
            {todoTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={buttonOnClichHandler}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn("modal", "overlay", {
          "is-active":
            (!clearButtonClicked && selectedTodoId) ||
            (clearButtonClicked && completedTodoIds.includes(todo.id)),
        })}
      >
        <div
          className={cn("has-background-white-ter", {
            "modal-background":
              (!clearButtonClicked && todo.id === selectedTodoId) ||
              (clearButtonClicked && completedTodoIds.includes(todo.id)),
          })}
        />
        <div
          className={cn({
            loader:
              isSubmiting &&
              ((!clearButtonClicked && todo.id === selectedTodoId) ||
                (clearButtonClicked && completedTodoIds.includes(todo.id))),
          })}
        />
      </div>
    </div>
  );
};
