"use client"

import React from "react"

import { useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileCode2, MessageSquare } from "lucide-react"

interface DynamicInputsProps {
  template: string
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

const variableLabels: Record<string, { label: string; placeholder: string; icon: React.ReactNode }> = {
  file_list: {
    label: "涉及文件路径 / 上下文",
    placeholder: "例如: @/views/User.vue (可能是参考，也可能是修改目标)",
    icon: <FileCode2 className="h-4 w-4" />,
  },
  user_intent: {
    label: "业务需求 / 改动描述",
    placeholder: "描述你的具体需求...",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  json_data: {
    label: "JSON 数据",
    placeholder: "粘贴你的 JSON 数据...",
    icon: <FileCode2 className="h-4 w-4" />,
  },
  interface_name: {
    label: "接口名称",
    placeholder: "例如: UserResponse",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  test_target: {
    label: "测试目标",
    placeholder: "描述要测试的函数或组件...",
    icon: <FileCode2 className="h-4 w-4" />,
  },
  reference_code: {
    label: "参考代码",
    placeholder: "粘贴参考代码...",
    icon: <FileCode2 className="h-4 w-4" />,
  },
}

function getVariableConfig(variable: string) {
  return (
    variableLabels[variable] || {
      label: variable.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      placeholder: `输入 ${variable}...`,
      icon: <MessageSquare className="h-4 w-4" />,
    }
  )
}

export function DynamicInputs({ template, values, onChange }: DynamicInputsProps) {
  const variables = useMemo(() => {
    const matches = template.match(/\{([^}]+)\}/g) || []
    return [...new Set(matches.map((m) => m.slice(1, -1)))]
  }, [template])

  if (variables.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-card p-6">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">暂无可配置的变量</p>
          <p className="text-xs mt-1">{"在模板中使用 {变量名} 来添加动态字段"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">动态参数输入</h3>
          <span className="text-xs text-muted-foreground">Dynamic Inputs</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {variables.map((variable) => {
          const config = getVariableConfig(variable)
          return (
            <div key={variable} className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground text-sm">
                <span className="text-primary">{config.icon}</span>
                {config.label}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                  {`{${variable}}`}
                </code>
              </Label>
              <Textarea
                value={values[variable] || ""}
                onChange={(e) => onChange(variable, e.target.value)}
                placeholder={config.placeholder}
                className="bg-input border-border font-mono text-sm min-h-[80px] focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
