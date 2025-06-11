interface TodoTitleProps {
  title: string;
  onDoubleClick?: () => void;
}

export const TodoTitle: React.FC<TodoTitleProps> = ({
  title,
  onDoubleClick,
}) => {
  return (
    <span
      data-cy="TodoTitle"
      className="todo__title"
      onDoubleClick={onDoubleClick}
    >
      {title}
    </span>
  );
};
