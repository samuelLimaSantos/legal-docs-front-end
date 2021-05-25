import { Route, Switch, BrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  )
}

export { Routes };