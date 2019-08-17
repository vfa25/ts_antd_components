import React from 'react'
import classNames from 'classnames'
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider'
import { ButtonSize } from './button'

export interface ButtonGroupProps {
    size?: ButtonSize
    style?: React.CSSProperties
    className?: string
    prefixCls?: string
}

const ButtonGroup: React.SFC<ButtonGroupProps> = props => (
    <ConfigConsumer>
        {({ getPrefixCls }: ConfigConsumerProps) => {
            const { prefixCls: customizePrefixCls, size, className, ...others } = props
            const prefixCls = getPrefixCls('btn-props', customizePrefixCls)

            // large => lg
            // small => sm
            let sizeCls = ''
            switch (size) {
                case 'large':
                    sizeCls = 'lg'
                    break
                case 'small':
                    sizeCls = 'sm'
                default:
                    break
            }

            const classes = classNames(
                prefixCls,
                {
                    [`${prefixCls}-${sizeCls}`]: sizeCls
                },
                className
            )

            return <div {...others} className={classes} />
        }}
    </ConfigConsumer>
)

export default ButtonGroup
