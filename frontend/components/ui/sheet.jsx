"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog@1.1.2";
import { cn } from "./utils";

function Sheet(props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({ className, side = "right", ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out animate-in slide-in-from-right-80 duration-300",
          side === "top" && "inset-x-0 top-0 border-b",
          side === "bottom" && "inset-x-0 bottom-0 border-t",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l",
          className,
        )}
        side={side}
        {...props}
      />
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div data-slot="sheet-header" className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div data-slot="sheet-footer" className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
