import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage, LoginPage } from "../Pages";
import { observer } from "mobx-react";
import { Layout, Button } from "antd";
const { Header, Content } = Layout;

import { rootStore } from "../stores";
import { RootProvider, RootContext } from "../rootContext";

const App = observer(() => {
  const { userStore } = useContext(RootContext);
  const { isLogin } = userStore;

  return (
    <Router>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="logo" />
          <Button type="primary" href="/login">
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
    </Router>
  );
});

ReactDOM.render(
  <RootProvider store={rootStore}>
    <App />
  </RootProvider>,
  document.getElementById("root")
);
