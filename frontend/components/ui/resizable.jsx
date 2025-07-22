"use client";

import * as React from "react";
import * as ResizablePrimitive from "@radix-ui/react-resizable@0.0.1";
import { cn } from "./utils";

function Resizable({ className, ...props }) {
  return (
    <ResizablePrimitive.Root
      data-slot="resizable"
      className={cn("flex w-full", className)}
      {...props}
    />
  );
}

function ResizableHandle({ className, ...props }) {
  return (
    <ResizablePrimitive.Handle
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-2 cursor-col-resize items-center justify-center bg-border transition-colors hover:bg-accent focus:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({ className, ...props }) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("min-w-[100px] flex-1", className)}
      {...props}
    />
  );
}

export { Resizable, ResizableHandle, ResizablePanel };
