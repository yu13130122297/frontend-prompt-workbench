"use client"

import React from "react"

import { Plus, FileText, Wrench, Link, FlaskConical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export interface Scenario {
  id: string
  name: string
  icon: string
  template: string
}

interface ScenarioSidebarProps {
  scenarios: Scenario[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: (scenario: Omit<Scenario, "id">) => void
  onDelete: (id: string) => void
}

const iconMap: Record<string, React.ReactNode> = {
  "file": <FileText className="h-4 w-4" />,
  "wrench": <Wrench className="h-4 w-4" />,
  "link": <Link className="h-4 w-4" />,
  "flask": <FlaskConical className="h-4 w-4" />,
}

export function ScenarioSidebar({
  scenarios,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: ScenarioSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newScenario, setNewScenario] = useState({
    name: "",
    icon: "file",
    template: "",
  })

  const handleSubmit = () => {
    if (newScenario.name.trim() && newScenario.template.trim()) {
      onAdd(newScenario)
      setNewScenario({ name: "", icon: "file", template: "" })
      setDialogOpen(false)
    }
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wider">
          业务场景列表
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Scenarios</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {scenarios.map((scenario) => (
            <li key={scenario.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(scenario.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left",
                  selectedId === scenario.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span className={cn(
                  "flex-shrink-0",
                  selectedId === scenario.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {iconMap[scenario.icon] || <FileText className="h-4 w-4" />}
                </span>
                <span className="truncate">{scenario.name}</span>
              </button>
              {scenarios.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(scenario.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
            >
              <Plus className="h-4 w-4" />
              添加自定义场景
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">创建新场景</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">场景名称</Label>
                <Input
                  id="name"
                  placeholder="例如: 代码审查"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">图标</Label>
                <div className="flex gap-2">
                  {Object.entries(iconMap).map(([key, icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewScenario({ ...newScenario, icon: key })}
                      className={cn(
                        "p-2 rounded-md border transition-colors",
                        newScenario.icon === key
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template" className="text-foreground">提示词模板</Label>
                <Textarea
                  id="template"
                  placeholder="使用 {变量名} 来标记变量..."
                  value={newScenario.template}
                  onChange={(e) => setNewScenario({ ...newScenario, template: e.target.value })}
                  className="bg-input border-border font-mono text-sm min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                创建场景
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  )
}
