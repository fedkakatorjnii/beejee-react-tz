import React, { useContext, useMemo } from "react";
import { observer } from "mobx-react";
import { Modal, Form, Input, Button, Radio } from "antd";
import { Task } from "../API/types";
import { RootContext } from "../rootContext";

export const FormDialog = observer(
  ({
    initialValue = {},
    onCancel,
  }: {
    initialValue?: Partial<Task>;
    onCancel(): void;
  }) => {
    const { taskStore } = useContext(RootContext);
    const { editTask, errors } = taskStore;

    const error = useMemo(() => errors.edit, [errors, errors.edit]);

    return (
      <Modal
        title={editTask?.id === undefined ? "Создать" : "Изменить"}
        visible={true}
        onCancel={onCancel}
        footer={[
          <Button key="FormDialog_modal_cancel_btn" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="FormDialog_modal_ok_btn" onClick={taskStore.storeTask}>
            OK
          </Button>,
        ]}
      >
        <Form>
          {!editTask?.id && (
            <Form.Item
              help={error?.username}
              messageVariables={
                error?.username ? { username: error?.username } : undefined
              }
              validateStatus={error?.username ? "error" : "validating"}
              rules={[
                {
                  required: true,
                  message: error?.username,
                },
              ]}
            >
              <Input
                id="username"
                placeholder="Введите имя"
                value={editTask?.username}
                disabled={!!editTask?.id!}
                onChange={(event) =>
                  taskStore.changeEditTask("username", event.target.value)
                }
              />
            </Form.Item>
          )}
          {!editTask?.id && (
            <Form.Item
              help={error?.email}
              messageVariables={
                error?.email ? { email: error?.email } : undefined
              }
              validateStatus={error?.email ? "error" : "validating"}
              rules={[
                {
                  required: true,
                  message: error?.email,
                },
              ]}
            >
              <Input
                id="email"
                placeholder="Введите email"
                value={editTask?.email}
                disabled={!!editTask?.id}
                onChange={(event) =>
                  taskStore.changeEditTask("email", event.target.value)
                }
              />
            </Form.Item>
          )}
          <Form.Item
            help={error?.text}
            messageVariables={error?.text ? { text: error?.text } : undefined}
            validateStatus={error?.text ? "error" : "validating"}
            rules={[
              {
                required: true,
                message: error?.text,
              },
            ]}
          >
            <Input
              id="text"
              placeholder="Введите текст"
              value={editTask?.text}
              onChange={(event) =>
                taskStore.changeEditTask("text", event.target.value)
              }
            />
          </Form.Item>

          {/* Radio */}
          {!!editTask?.id && (
            <Form.Item
              help={error?.status}
              messageVariables={
                error?.status ? { status: error?.status } : undefined
              }
              validateStatus={error?.status ? "error" : "validating"}
              rules={[
                {
                  required: true,
                  message: error?.status,
                },
              ]}
            >
              <Radio.Group
                id="status"
                value={editTask?.status}
                onChange={(event) =>
                  taskStore.changeEditTask("status", event.target.value)
                }
              >
                <Radio value={0}>задача не выполнена</Radio>
                <Radio value={1}>
                  задача не выполнена, отредактирована админом
                </Radio>
                <Radio value={10}>задача выполнена</Radio>
                <Radio value={11}>
                  задача отредактирована админом и выполнена
                </Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  }
);
