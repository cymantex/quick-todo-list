import { Todo } from "@/todo/TodoStore";
import React from "react";
import classNames from "classnames";

interface TodoInputProps {
  todo: Todo;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onBlur: () => void;
  selected: boolean;
  marked: boolean;
}

export function TodoInput({ todo, onChange, onClick, onBlur, selected, marked }: TodoInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (marked) {
      inputRef.current?.focus();
    }
  }, [marked]);

  return (
    <input
      ref={inputRef}
      onClick={onClick}
      type={"text"}
      value={todo.text}
      onBlur={onBlur}
      className={classNames(
        "pl-2 pt-1 pb-1 w-full outline-none hover:bg-secondary-focus cursor-pointer",
        {
          "bg-inherit": !selected,
          "bg-secondary": selected,
        },
      )}
      onChange={onChange}
    />
  );
}
