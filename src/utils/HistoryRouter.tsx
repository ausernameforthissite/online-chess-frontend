import React from "react";
import { History } from "history";
import { BrowserRouterProps as NativeBrowserRouterProps, Router } from "react-router-dom";

export interface BrowserRouterProps extends Omit<NativeBrowserRouterProps, "window"> {
    history: History;
}

export const HistoryRouter: React.FC<BrowserRouterProps> = React.memo(props => {
    const { history, ...restProps } = props;
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });

    React.useLayoutEffect(() => history.listen(setState), [history]);

    return <Router {...restProps} location={state.location} navigationType={state.action} navigator={history} />;
});