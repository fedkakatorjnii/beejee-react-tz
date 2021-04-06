import React, { useContext, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { Modal, Form, Button, Input } from "antd";
import { RootContext } from "../rootContext";
import { isUserFormValue } from "../utils";

export const LoginPage = observer(() => {
  const history = useHistory();
  const { userStore } = useContext(RootContext);
  const { isLogin, userName, password, errors } = userStore;
  const error = useMemo(() => errors.login, [errors.login]);

  useEffect(() => {
    if (!isLogin) {
      return;
    }

    isLogin && history.push("/");
  }, [isLogin]);

  return (
    <Modal
      title="Авторизация"
      visible
      centered
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      footer={[
        <Button key="Login_modal_cancel_btn" href="/">
          Cancel
        </Button>,
        <Button
          key="Login_modal_ok_btn"
          onClick={userStore.loginAPI}
          disabled={!isUserFormValue({ userName, password })}
        >
          OK
        </Button>,
      ]}
    >
      <Form>
        <Form.Item
          help={error?.username}
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
            value={userName || undefined}
            onChange={(event) => userStore.setUserName(event.target.value)}
          />
        </Form.Item>
        <Form.Item
          help={error?.password}
          validateStatus={error?.password ? "error" : "validating"}
          rules={[
            {
              required: true,
              message: error?.password,
            },
          ]}
        >
          <Input.Password
            id="password"
            placeholder="Введите пароль"
            value={password || undefined}
            onChange={(event) => userStore.setPassword(event.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
