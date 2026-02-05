"use client"

import React from "react"

import { Copy, Save, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"

interface PreviewPanelProps {
  template: string
  values: Record<string, string>
  onSave: () => void
}

function generatePrompt(template: string, values: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || `{${key}}`)
  }
  return result
}

function highlightContent(text: string, values: Record<string, string>): React.ReactNode[] {
  // First, find all variable positions (both filled and unfilled)
  const segments: { start: number; end: number; type: "filled" | "unfilled"; text: string }[] = []

  // Find unfilled variables
  const unfilledMatches = text.matchAll(/\{([^}]+)\}/g)
  for (const match of unfilledMatches) {
    if (match.index !== undefined) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "unfilled",
        text: match[0],
      })
    }
  }

  // Find filled values
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      let searchIndex = 0
      while (searchIndex < text.length) {
        const foundIndex = text.indexOf(value, searchIndex)
        if (foundIndex === -1) break

        // Check if this position overlaps with an unfilled variable
        const overlaps = segments.some(
          seg => foundIndex < seg.end && foundIndex + value.length > seg.start
        )

        if (!overlaps) {
          segments.push({
            start: foundIndex,
            end: foundIndex + value.length,
            type: "filled",
            text: value,
          })
        }

        searchIndex = foundIndex + value.length
      }
    }
  }

  // Sort segments by position
  segments.sort((a, b) => a.start - b.start)

  // Build result
  const result: React.ReactNode[] = []
  let lastIndex = 0

  for (const segment of segments) {
    // Add text before this segment
    if (segment.start > lastIndex) {
      const beforeText = text.slice(lastIndex, segment.start)
      result.push(<span key={`text-${lastIndex}`}>{beforeText}</span>)
    }

    // Add the segment
    result.push(
      <span
        key={`seg-${segment.start}`}
        className="text-primary bg-primary/10 px-0.5 rounded"
      >
        {segment.text}
      </span>
    )

    lastIndex = segment.end
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex)
    result.push(<span key="text-end">{remainingText}</span>)
  }

  return result
}

export function PreviewPanel({ template, values, onSave }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const finalPrompt = useMemo(() => generatePrompt(template, values), [template, values])
  const highlightedContent = useMemo(() => highlightContent(finalPrompt, values), [finalPrompt, values])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const hasUnfilledVariables = finalPrompt.includes("{")
  const charCount = finalPrompt.length
  const wordCount = finalPrompt.trim().split(/\s+/).filter(Boolean).length

  return (
    <aside className="w-96 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">最终提示词预览</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Final Prompt</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-muted/30 rounded-lg border border-border p-4 min-h-[300px]">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
              {highlightedContent}
            </pre>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{charCount} 字符 / {wordCount} 词</span>
            {hasUnfilledVariables && (
              <span className="text-chart-3">存在未填充变量</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={handleCopy}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              复制到剪贴板 (Copy for Cursor)
            </>
          )}
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          className="w-full gap-2 border-border hover:bg-muted bg-transparent"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              已保存
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存当前规则
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
