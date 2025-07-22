"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar@1.1.2";
import { cn } from "./utils";

function Menubar(props) {
  return <MenubarPrimitive.Root data-slot="menubar" {...props} />;
}

function MenubarMenu(props) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({ className, ...props }) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({ className, ...props }) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 border-border z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}

function MenubarItem({ className, ...props }) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({ className, ...props }) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function MenubarLabel({ className, ...props }) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      className={cn("px-2 py-1.5 text-sm font-medium", className)}
      {...props}
    />
  );
}

function MenubarGroup(props) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarCheckboxItem({ className, ...props }) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function MenubarRadioGroup(props) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarRadioItem({ className, ...props }) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function MenubarShortcut({ className, ...props }) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarGroup,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarShortcut,
};
