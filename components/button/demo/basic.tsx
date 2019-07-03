import * as React from 'react';
import Button from '..';

class Basic extends React.Component {
  render() {
    return <div>
    <Button type="primary">Primary</Button>
    <Button>Default</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="danger">Danger</Button>
    <Button type="link">Link</Button>
  </div>;
  }
}
export default Basic;
