import * as React from "react";
import { Hello } from "./components/Hello";

export class App extends React.Component<any, any> {
    render() {
        return (
            <Hello compiler="TypeScript" framework="React" />
        );
    }
}