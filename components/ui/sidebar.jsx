"use client";

import * as React from "react";
import { cn } from "./utils";

function Sidebar({ className, ...props }) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex flex-col w-64 h-full bg-background border-r border-border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex items-center h-16 px-6 border-b border-border", className)}
      {...props}
    />
  );
}

function SidebarBody({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-body"
      className={cn("flex-1 overflow-y-auto px-4 py-6", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("h-16 px-6 border-t border-border flex items-center", className)}
      {...props}
    />
  );
}

export { Sidebar, SidebarHeader, SidebarBody, SidebarFooter };
