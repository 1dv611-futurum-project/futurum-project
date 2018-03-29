import * as React from 'react';
import { Hello } from './components/Hello';

export class App extends React.Component<any, any> {
  public render() {
    return (
            <Hello compiler='TypeScript' framework='React' />
    );
  }
}
