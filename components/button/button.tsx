import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import omit from 'omit.js'
import { Icon } from 'antd'
import { tuple, htmlRef, Omit } from '../_util/type'
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider'
import Group from './button-group'

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
// const isTwoCNChar = val => rxTwoCNChar.test(val)
// 两种方式对比，前者可防止test方法被重写

function isString(str: any): boolean {
    return typeof str === 'string'
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactChild, needInserted: boolean) {
    // Check the child if is undefined or null.
    if (child === null || child === undefined) return
    const SPACE = needInserted ? ' ' : ''
    // strictNullChecks oops.
    if (
        typeof child !== 'string' &&
        typeof child !== 'number' &&
        isString(child.type) &&
        isTwoCNChar(child.props.children)
    ) {
        return React.cloneElement(child, {}, child.props.children.split('').join(SPACE))
    }
    if (typeof child === 'string') {
        if (isTwoCNChar(child)) {
            child = child.split('').join(SPACE)
        }
        return <span>{child}</span>
    }
    return child
}

// 该辅助函数用于优化 child 为基本类型时的渲染
function spaceChildren(children: React.ReactNode, needInserted: boolean) {
    let isPrevChildPure = false
    const childList: React.ReactNode[] = []
    React.Children.forEach(children, child => {
        const type = typeof child
        const isCurrentChildPure = type === 'string' || type === 'number'
        if (isPrevChildPure && isCurrentChildPure) {
            const lastIndex = childList.length - 1
            const lastChild = childList[lastIndex]
            childList[lastIndex] = `${lastChild}${child}`
        } else {
            childList.push(child)
        }
        isPrevChildPure = isCurrentChildPure
    })

    // Pass to React.Children.map to auto fill key
    return React.Children.map(childList, child =>
        insertSpace(child as React.ReactChild, needInserted)
    )
}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger', 'link')
export type ButtonType = (typeof ButtonTypes)[number]
const ButtonShapes = tuple('circle', 'circle-outline', 'round')
export type ButtonShape = (typeof ButtonShapes)[number]
const ButtonSizes = tuple('large', 'default', 'small')
export type ButtonSize = (typeof ButtonSizes)[number]
const ButtonHTMLTypes = tuple('submit', 'button', 'reset')
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number]

export interface BaseButtonProps {
    type?: ButtonType
    icon?: string
    shape?: ButtonShape
    loading?: boolean | { delay?: number }
    prefixCls?: string
    className?: string
    size?: ButtonSize
    ghost?: boolean
    block?: boolean
    children?: React.ReactNode
}

interface PropsDefault {
    htmlType: string
}

export type AnchorButtonProps = {
    href: string
    target?: string
    onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'> // eslint-disable-line @typescript-eslint/indent

export type NativeButtonProps = {
    htmlType?: ButtonHTMLType
    onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
    Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'> // eslint-disable-line @typescript-eslint/indent

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>

interface ExportType<E> extends React.FC<E> {
    Group: typeof Group
}

export const Button: ExportType<ButtonProps> = props => {
    const {
        prefixCls: customizePrefixCls,
        type,
        shape,
        size,
        className,
        children,
        icon,
        ghost,
        loading: _loadingProp,
        block,
        onClick,
        ...rest
    } = props

    const [loading, setLoading] = useState(props.loading)
    let delayTimeout: number
    const [hasTwoCNChar, setHasTwoCNChar] = useState(false)

    // 缓存ref
    const buttonNodeRef = useRef<htmlRef & HTMLButtonElement & HTMLAnchorElement>(null)

    useEffect(() => {
        if (_loadingProp instanceof Boolean) {
            setLoading(_loadingProp)
        }

        if (_loadingProp && typeof _loadingProp !== 'boolean' && _loadingProp.delay) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            delayTimeout = window.setTimeout(() => setLoading(_loadingProp), _loadingProp.delay)
        } else {
            setLoading(_loadingProp)
        }

        return () => {
            if (_loadingProp && typeof _loadingProp !== 'boolean') {
                clearTimeout(delayTimeout)
            }
        }
    }, [_loadingProp])

    useEffect(() => {
        fixTwoCNChar()
    })

    const fixTwoCNChar = () => {
        // 边缘情况处理
        // Fix for HOC usage like <FormatMessage />
        if (!buttonNodeRef.current) {
            return
        }
        const buttonText = buttonNodeRef.current.textContent || buttonNodeRef.current.innerHTML
        if (isNeedInserted() && isTwoCNChar(buttonText)) {
            if (!hasTwoCNChar) {
                setHasTwoCNChar(true)
            }
        } else if (hasTwoCNChar) {
            setHasTwoCNChar(false)
        }
    }

    const handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = e => {
        if (!!loading) {
            return
        }
        if (onClick) {
            ;(onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e)
        }
    }

    const isNeedInserted = () => {
        return React.Children.count(children) === 1 && !icon
    }

    const renderButton = ({ getPrefixCls, autoInsertSpaceInButton }: ConfigConsumerProps) => {
        const prefixCls = getPrefixCls('btn', customizePrefixCls)
        const autoInsertSpace = autoInsertSpaceInButton !== false

        // large => lg
        // small => sm
        let sizeCls = ''
        switch (size) {
            case 'large':
                sizeCls = 'lg'
                break
            case 'small':
                sizeCls = 'sm'
                break
            default:
                break
        }

        const classes = classNames(prefixCls, className, {
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${shape}`]: shape,
            [`${prefixCls}-${sizeCls}`]: sizeCls,
            [`${prefixCls}-icon-only`]: !children && children !== 0 && icon,
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-background-ghost`]: ghost,
            [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
            [`${prefixCls}-block`]: block
        })
        const iconType = loading ? 'loading' : icon
        const iconNode = iconType ? <Icon type={iconType} /> : null
        const kids =
            children || children === 0
                ? spaceChildren(children, isNeedInserted() && autoInsertSpace)
                : null

        const linkButtonRestProps = omit(rest as AnchorButtonProps & PropsDefault, ['htmlType'])
        if (linkButtonRestProps.href !== undefined) {
            return (
                <a
                    {...linkButtonRestProps}
                    className={classes}
                    onClick={handleClick}
                    ref={buttonNodeRef}
                >
                    {iconNode}
                    {kids}
                </a>
            )
        }
        const { htmlType, ...otherProps } = rest as NativeButtonProps

        const bottonNode = (
            <button
                {...(otherProps as NativeButtonProps)}
                type={htmlType}
                className={classes}
                onClick={handleClick}
                ref={buttonNodeRef}
            >
                {iconNode}
                {kids}
            </button>
        )
        return bottonNode
    }

    return <ConfigConsumer>{renderButton}</ConfigConsumer>
}

Button.defaultProps = {
    loading: false,
    ghost: false,
    block: false,
    htmlType: 'button'
}

Button.propTypes = {
    type: PropTypes.oneOf(ButtonTypes),
    icon: PropTypes.string,
    shape: PropTypes.oneOf(ButtonShapes),
    htmlType: PropTypes.oneOf(ButtonHTMLTypes),
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    size: PropTypes.oneOf(ButtonSizes),
    onClick: PropTypes.func,
    block: PropTypes.bool
}

Button.Group = Group

export default Button
