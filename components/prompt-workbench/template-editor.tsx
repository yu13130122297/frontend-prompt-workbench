"use client"

import React from "react"

import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TemplateEditorProps {
  value: string
  onChange: (value: string) => void
}

function highlightVariables(text: string): React.ReactNode[] {
  const parts = text.split(/(\{[^}]+\})/g)
  return parts.map((part, index) => {
    if (part.match(/^\{[^}]+\}$/)) {
      return (
        <span key={index} className="text-primary bg-primary/15 px-1 rounded">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function TemplateEditor({ value, onChange }: TemplateEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setDisplayValue(newValue)
      onChange(newValue)
    },
    [onChange]
  )

  const lineCount = displayValue.split("\n").length

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
        tabIndex={0}
        role="button"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">生成规则配置</h3>
          <span className="text-xs text-muted-foreground">Prompt Template</span>
        </div>
        <button
          type="button"
          className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
            <Info className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {"使用 "}
              <code className="bg-primary/15 text-primary px-1 rounded">
                {"{变量名}"}
              </code>
              {" 标记变量，下方输入框将自动生成对应字段。"}
            </span>
          </div>

          <div
            className={cn(
              "relative rounded-md border transition-colors overflow-hidden",
              isFocused ? "border-primary ring-1 ring-primary/30" : "border-border"
            )}
          >
            <div className="flex">
              {/* Line numbers */}
              <div className="bg-muted/50 border-r border-border px-3 py-3 select-none text-right min-w-[3rem]">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground leading-6 font-mono"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editor area */}
              <div className="flex-1 relative">
                {/* Highlighted overlay */}
                <div
                  className="absolute inset-0 p-3 font-mono text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none overflow-hidden text-foreground"
                  aria-hidden="true"
                >
                  {highlightVariables(displayValue)}
                </div>

                {/* Actual textarea */}
                <textarea
                  value={displayValue}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-full min-h-[200px] p-3 font-mono text-sm leading-6 bg-transparent text-transparent caret-foreground resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
