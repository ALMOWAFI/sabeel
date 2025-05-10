/**
 * Multi-select component for selecting multiple options
 * Used for notification settings in the Islamic events manager
 */

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

interface MultiSelectProps {
  options: {
    value: string;
    label: string;
  }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    
    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className={`relative ${className}`} dir="rtl">
      <div
        className="relative flex min-h-[38px] w-full items-center justify-end rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        onClick={() => {
          setIsOpen(!isOpen);
          inputRef.current?.focus();
        }}
      >
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mr-2">
            {selected.map((value) => (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {options.find((option) => option.value === value)?.label}
                <button
                  type="button"
                  className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length > 0 ? "" : placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-right"
        />
      </div>
      
      <div className="relative mt-1">
        {isOpen && (
          <div className="absolute top-0 left-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <Command className="w-full">
              <CommandGroup className="h-full overflow-auto">
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={`flex cursor-pointer items-center justify-between ${
                        isSelected ? "bg-accent/50" : ""
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <span>✓</span>}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
}
