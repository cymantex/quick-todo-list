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

export function TodoInputButton({
  todo,
  onChange,
  onClick,
  onBlur,
  selected,
  marked,
}: TodoInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (marked) {
      inputRef.current?.focus();
    }
  }, [marked]);

  return (
    <button
      onClick={onClick}
      className={classNames("w-full pl-2 pt-1 pb-1 text-left", {
        "btn-primary": selected,
      })}
    >
      {!marked && todo.text}
      <input
        ref={inputRef}
        type={marked ? "text" : "hidden"}
        value={marked ? todo.text : ""}
        onBlur={onBlur}
        className={"w-full border-none outline-none bg-secondary hover:bg-inherit"}
        onChange={onChange}
      />
    </button>
  );
}
