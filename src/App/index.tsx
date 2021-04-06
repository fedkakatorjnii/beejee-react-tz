import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { HomePage, LoginPage } from "../Pages";
import { observer } from "mobx-react";
import { Layout, Button } from "antd";
const { Header, Content } = Layout;

import { rootStore } from "../stores";
import { RootProvider, RootContext } from "../rootContext";

const App = observer(() => {
  const { userStore, taskStore } = useContext(RootContext);
  const { isLogin } = userStore;
  const { errors } = taskStore;
  const history = useHistory();

  useEffect(() => {
    if (!errors.edit || !errors.edit.token) {
      return;
    }

    userStore.logoutAPI();
    history.push("/login");
  }, [errors.edit?.token]);

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="logo" />
        <Button
          type="primary"
          onClick={() => {
            isLogin ? userStore.logoutAPI() : history.push("/login");
          }}
        >
          {isLogin ? "sign out" : "sign in"}
        </Button>
      </Header>
      <Content>
        <Switch>
          <Route key="login" path="/login/">
            <LoginPage key="login" />
          </Route>
          <Route key="home" path="/">
            <HomePage key="home" />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
});

ReactDOM.render(
  <RootProvider store={rootStore}>
    <Router>
      <App />
    </Router>
  </RootProvider>,
  document.getElementById("root")
);
