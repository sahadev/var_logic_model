import { useState, useEffect, useCallback } from "react";
import { ScrollArea, Text, ActionIcon, TextInput, Group } from "@mantine/core";
import { dbManager, GraphRecord } from "../utils/indexedDB";
import { getInstance } from "src/extends/Graph";
import { notifications } from "@mantine/notifications";

const graphInstance = getInstance();

/**
 * 数据记录列表组件
 */
export const DataRecordList = () => {
  const [records, setRecords] = useState<GraphRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // 加载所有记录
  const loadRecords = useCallback(async () => {
    try {
      const allRecords = await dbManager.getAllRecords();
      setRecords(allRecords);
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "加载记录失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // 开始编辑标题
  const startEdit = (record: GraphRecord) => {
    setEditingId(record.id!);
    setEditingTitle(record.title);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // 保存编辑的标题
  const saveEdit = useCallback(async (id: number) => {
    if (!editingTitle.trim()) {
      notifications.show({
        title: "错误",
        message: "标题不能为空",
        color: "red",
      });
      return;
    }

    try {
      await dbManager.updateRecordTitle(id, editingTitle.trim());
      setEditingId(null);
      setEditingTitle("");
      await loadRecords();
      notifications.show({
        title: "成功",
        message: "标题已更新",
      });
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "更新标题失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, [editingTitle, loadRecords]);

  // 删除记录
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("确定要删除这条记录吗？")) {
      return;
    }

    try {
      await dbManager.deleteRecord(id);
      await loadRecords();
      notifications.show({
        title: "成功",
        message: "记录已删除",
      });
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "删除记录失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, [loadRecords]);

  // 导入记录
  const handleImport = useCallback(async (record: GraphRecord) => {
    try {
      graphInstance.graph.configure(record.data, false);
      notifications.show({
        title: "导入成功",
        message: `已导入: ${record.title}`,
      });
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "导入失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, []);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return "刚刚";
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // 暴露刷新方法给父组件
  useEffect(() => {
    (window as any).refreshDataRecordList = loadRecords;
    return () => {
      delete (window as any).refreshDataRecordList;
    };
  }, [loadRecords]);

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Text size="lg" fw={600}>
          数据记录
        </Text>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {records.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Text size="sm">暂无记录</Text>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="mb-2 p-3 border border-gray-200 rounded hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleImport(record)}
              >
                {editingId === record.id ? (
                  <div className="flex items-center gap-2">
                    <TextInput
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.currentTarget.value)}
                      size="xs"
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(record.id!);
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                    <ActionIcon
                      color="green"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit(record.id!);
                      }}
                    >
                      ✓
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                    >
                      ✕
                    </ActionIcon>
                  </div>
                ) : (
                  <>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {record.title}
                      </Text>
                      <Group gap={4}>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(record);
                          }}
                        >
                          ✎
                        </ActionIcon>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id!);
                          }}
                        >
                          🗑
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {formatTime(record.updatedAt)}
                    </Text>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

