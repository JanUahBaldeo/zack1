"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area@1.1.2";
import { cn } from "./utils";

function ScrollArea({ className, ...props }) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

function ScrollAreaViewport({ className, ...props }) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn("h-full w-full rounded-[inherit]", className)}
      {...props}
    />
  );
}

function ScrollAreaCorner(props) {
  return <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" {...props} />;
}

export { ScrollArea, ScrollBar, ScrollAreaViewport, ScrollAreaCorner };
