type Props = {
  completed: boolean;
  onToggle?: () => void;
};

export const Toggler: React.FC<Props> = ({
  completed,
  onToggle = () => { },
}) => {
  return (
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        onChange={onToggle}
        checked={completed}
      />
    </label>
  );
};
