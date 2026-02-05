"use client"

import { useState, useCallback, useEffect } from "react"
import { ScenarioSidebar, type Scenario } from "./scenario-sidebar"
import { TemplateEditor } from "./template-editor"
import { DynamicInputs } from "./dynamic-inputs"
import { PreviewPanel } from "./preview-panel"

const defaultScenarios: Scenario[] = [
  {
    id: "refactor-new",
    name: "仿写新增",
    icon: "file",
    template: `你是一个资深前端专家。
请阅读以下上下文文件：
{file_list}

任务目标：
{user_intent}

注意：请根据上下文文件的代码风格进行操作。如果文件是参考用途，请不要修改原文件。`,
  },
  {
    id: "modification",
    name: "现有修改",
    icon: "wrench",
    template: `你是一个资深前端专家。
请阅读以下需要修改的文件：
{file_list}

修改需求：
{user_intent}

注意：
1. 保持现有代码风格和架构
2. 只修改必要的部分
3. 确保不引入新的 bug`,
  },
  {
    id: "api-sync",
    name: "接口对齐",
    icon: "link",
    template: `你是一个资深前端专家，擅长 TypeScript 类型系统。
请将以下 JSON 数据转换为 TypeScript 接口定义：

JSON 数据：
{json_data}

接口名称：{interface_name}

要求：
1. 使用 interface 而非 type
2. 添加必要的 JSDoc 注释
3. 正确处理可选字段
4. 嵌套对象需要单独定义接口`,
  },
  {
    id: "unit-test",
    name: "单元测试",
    icon: "flask",
    template: `你是一个资深前端测试专家。
请为以下代码编写单元测试：

测试目标：
{test_target}

参考代码：
{reference_code}

要求：
1. 使用 Jest + Testing Library
2. 覆盖主要功能和边界情况
3. 测试用例命名清晰
4. 包含正向和反向测试`,
  },
]

export function PromptWorkbench() {
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios)
  const [selectedId, setSelectedId] = useState(defaultScenarios[0].id)
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // 从config目录加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/config")
        const data = await response.json()
        if (data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios)
        }
        if (data.selectedId) {
          setSelectedId(data.selectedId)
        }
        if (data.inputValues) {
          setInputValues(data.inputValues)
        }
      } catch (error) {
        console.error("加载配置失败:", error)
      } finally {
        setIsLoaded(true)
      }
    }
    loadConfig()
  }, [])

  // 自动保存到config目录
  useEffect(() => {
    if (!isLoaded) return // 首次加载完成前不保存

    const saveConfig = async () => {
      try {
        await fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarios,
            selectedId,
            inputValues,
            lastSaved: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("保存配置失败:", error)
      }
    }

    const timer = setTimeout(saveConfig, 500)
    return () => clearTimeout(timer)
  }, [scenarios, selectedId, inputValues, isLoaded])

  const selectedScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0]
  const currentValues = inputValues[selectedId] || {}

  const handleScenarioSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleAddScenario = useCallback((scenario: Omit<Scenario, "id">) => {
    const newScenario: Scenario = {
      ...scenario,
      id: `custom-${Date.now()}`,
    }
    setScenarios((prev) => [...prev, newScenario])
    setSelectedId(newScenario.id)
  }, [])

  const handleDeleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
    setSelectedId((prevId) => {
      if (prevId === id) {
        const remaining = scenarios.filter((s) => s.id !== id)
        return remaining[0]?.id || ""
      }
      return prevId
    })
  }, [scenarios])

  const handleTemplateChange = useCallback(
    (newTemplate: string) => {
      setScenarios((prev) =>
        prev.map((s) => (s.id === selectedId ? { ...s, template: newTemplate } : s))
      )
    },
    [selectedId]
  )

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      setInputValues((prev) => ({
        ...prev,
        [selectedId]: {
          ...(prev[selectedId] || {}),
          [key]: value,
        },
      }))
    },
    [selectedId]
  )

  const handleSave = useCallback(async () => {
    // 立即保存到 config 目录
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarios,
          selectedId,
          inputValues,
          lastSaved: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        console.log("✅ 配置已保存到 config 目录")
      }
    } catch (error) {
      console.error("保存失败:", error)
    }
  }, [scenarios, selectedId, inputValues])

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar - Scenario Management */}
      <ScenarioSidebar
        scenarios={scenarios}
        selectedId={selectedId}
        onSelect={handleScenarioSelect}
        onAdd={handleAddScenario}
        onDelete={handleDeleteScenario}
      />

      {/* Center - Template Editor & Dynamic Inputs */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {selectedScenario.name}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                编辑提示词模板和输入参数
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                场景 ID: {selectedId}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <TemplateEditor
            value={selectedScenario.template}
            onChange={handleTemplateChange}
          />
          <DynamicInputs
            template={selectedScenario.template}
            values={currentValues}
            onChange={handleInputChange}
          />
        </div>
      </main>

      {/* Right Panel - Preview */}
      <PreviewPanel
        template={selectedScenario.template}
        values={currentValues}
        onSave={handleSave}
      />
    </div>
  )
}
