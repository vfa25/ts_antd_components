import * as React from 'react'
// import Empty from '../empty';
import { ConfigConsumer, ConfigConsumerProps } from '.'
interface EmptyType {
    className?: string
}
const Empty = (props: EmptyType) => <div {...props}></div>

const renderEmpty = (componentName?: string): React.ReactNode => (
    <ConfigConsumer>
        {({ getPrefixCls }: ConfigConsumerProps) => {
            const prefix = getPrefixCls('empty')

            switch (componentName) {
                case 'Table':
                case 'List':
                // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                case 'Select':
                case 'TreeSelect':
                case 'Cascader':
                case 'Transfer':
                case 'Mentions':
                    // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={`${prefix}-small`}
                    return <Empty className={`${prefix}-small`} />
                default:
                    return <Empty />
            }
        }}
    </ConfigConsumer>
)

export type RenderEmptyHandler = typeof renderEmpty

export default renderEmpty
