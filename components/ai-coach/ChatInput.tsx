"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Ask FitGenie for a plan, adjustment, or explanation..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="flex justify-end">
        <Button
          disabled={disabled || !value.trim()}
          onClick={() => {
            onSend(value);
            setValue("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
