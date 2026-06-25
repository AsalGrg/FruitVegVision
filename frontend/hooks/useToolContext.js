'use client'
import { useContext } from "react";
import { ToolsContext } from "../context/ToolsContext";

export default function useTool() {
  const context = useContext(ToolsContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}