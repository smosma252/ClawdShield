import { Router, Switch, Route, Redirect } from 'wouter'
import { Shell } from './components/layout/Shell'
import { ScenariosPage } from './pages/scenarios/ScenariosPage'
import { SimulatePage } from './pages/simulate/SimulatePage'
import { PolicyPage } from './pages/policy/PolicyPage'
import './index.css'

function App() {
  return (
    <Router>
      <Shell>
        <Switch>
          <Route path="/" component={() => <Redirect to="/scenarios" />} />
          <Route path="/scenarios" component={ScenariosPage} />
          <Route path="/simulate" component={SimulatePage} />
          <Route path="/policy" component={PolicyPage} />
          <Route component={() => <Redirect to="/scenarios" />} />
        </Switch>
      </Shell>
    </Router>
  )
}

export default App
