import * as React from 'react';
// import Empty from '../empty';
import { ConfigConsumer, ConfigConsumerProps } from '.';
const Empty = () => <div></div>;

const renderEmpty = (componentName?: string): React.ReactNode => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const prefix = getPrefixCls('empty');
      console.log(prefix);

      switch(componentName) {
        case 'Table':
        case 'List':
          // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
        case 'Mentions':
          // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={`${prefix}-small`}
          return <Empty />
        default:
          return <Empty />;
      }
    }}
  </ConfigConsumer>
)

export type RenderEmptyHandler = typeof renderEmpty;

export default renderEmpty;
