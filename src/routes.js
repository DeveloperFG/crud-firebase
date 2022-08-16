import { BrowserRouter, Route, Switch } from "react-router-dom";


import Cadastrar from "./Pages/Cadastrar";



const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Cadastrar} />
            </Switch>
        </BrowserRouter>

    )
}

export default Routes;