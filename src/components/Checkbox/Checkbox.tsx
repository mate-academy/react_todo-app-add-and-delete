interface Props {
  labelClassName: string;
  inputClassName: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<Props> = ({
  checked,
  inputClassName,
  labelClassName,
  onChange,
}) => (
  <label className={labelClassName}>
    <input
      type="checkbox"
      checked={checked}
      className={inputClassName}
      onChange={onChange}
    />
  </label>
);
