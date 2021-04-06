import React, { useCallback, useContext, useMemo } from "react";
import { observer } from "mobx-react";
import { Table, TablePaginationConfig, Button } from "antd";
import { Task } from "../API/types";
import {
  ColumnType,
  ColumnsType,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { FormDialog } from "../FormDialog";
import { RootContext } from "../rootContext";
import { v4 as uuidv4 } from "uuid";

const STATUSES: { title: string; value: number }[] = [
  {
    value: 0,
    title: "задача не выполнена",
  },
  {
    value: 1,
    title: "задача не выполнена, отредактирована админом",
  },
  {
    value: 10,
    title: "задача выполнена",
  },
  {
    value: 11,
    title: "задача отредактирована админом и выполнена",
  },
];

export const HomePage = observer(() => {
  const { taskStore, userStore } = useContext(RootContext);
  const { isLogin } = userStore;
  const { tasks, total_task_count, loading, editTask } = taskStore;
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<Task> | SorterResult<Task>[],
      extra: TableCurrentDataSource<Task>
    ) => {
      const { current } = pagination;

      if (Array.isArray(sorter)) {
        return;
      }

      const { field, order } = sorter;
      const page = current ? current : 0;
      let sort_field: string | undefined;
      let sort_direction: "asc" | "desc" | undefined;

      if (order === "ascend") {
        sort_direction = "asc";
      } else if (order === "descend") {
        sort_direction = "desc";
      }
      if (typeof field === "string") {
        sort_field = field;
      }
      taskStore.changePagination({
        page,
        sort_field,
        sort_direction,
      });
    },
    [taskStore]
  );
  const columns: ColumnsType<Task> = useMemo(() => {
    let result: ColumnType<Task>[] = [
      {
        title: "id",
        dataIndex: "id",
        key: "id",
        sorter: true,
        width: "20%",
      },
      {
        title: "имя пользователя",
        dataIndex: "username",
        key: "username",
        sorter: true,
        width: "25%",
      },
      {
        title: "email",
        dataIndex: "email",
        key: "email",
        sorter: true,
        width: "25%",
      },
      {
        title: "текст задачи",
        dataIndex: "text",
        key: "text",
        sorter: true,
        width: "25%",
      },
      {
        title: "статус",
        dataIndex: "status",
        key: "status",
        sorter: true,
        width: "25%",
        render: (redord, task) => {
          let title = STATUSES[0].title;
          const status = STATUSES.find((item) => item.value === task.status);

          status !== undefined && (title = status.title);

          return title;
        },
      },
      {
        title: "Изменить",
        dataIndex: "edit",
        key: "edit",
        fixed: "right",
        render: (redord, task) => (
          <Button
            disabled={!isLogin}
            onClick={() => {
              isLogin &&
                taskStore.setEditTask({
                  ...task,
                  status: Math.trunc(task.status / 10) * 10,
                });
            }}
          >
            <EditOutlined />
          </Button>
        ),
      },
    ];

    return result.filter((res) => res.key !== "id");
  }, [isLogin, taskStore]);

  return (
    <>
      <Table<Task>
        rowKey={() => uuidv4()}
        loading={loading}
        dataSource={tasks}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          position: ["bottomRight"],
          pageSize: 3,
          total: total_task_count,
        }}
        footer={() => {
          return (
            <Button onClick={() => taskStore.setEditTask({ status: 0 })}>
              <PlusOutlined />
            </Button>
          );
        }}
      />
      {editTask !== null && (
        <FormDialog onCancel={() => taskStore.setEditTask(null)} />
      )}
    </>
  );
});
