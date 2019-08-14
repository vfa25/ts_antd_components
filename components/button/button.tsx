// eslint-disabled
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { tuple, htmlRef } from '../_util/type'
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider'

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

export interface BaseButtonProps {
    type?: ButtonType
    loading?: boolean | { delay?: number }
    prefixCls?: string
    className?: string
    children?: React.ReactNode[] | React.ReactNode
}

// 定义交差类型
export type AnchorButtonProps = {
    href: string
} & BaseButtonProps

export type ButtonProps = Partial<AnchorButtonProps>

function Button(props: ButtonProps) {
    const { prefixCls: customizePrefixCls, type, children, className, ...rest } = props

    const loadingType: boolean | { delay?: number } = false

    const [loading, setLoading] = useState(props.loading || loadingType)
    const [hasTwoCNChar, setHasTwoCNChar] = useState(false)

    const isNeedInserted = () => {
        return React.Children.count(children) === 1
    }

    // 缓存ref
    const buttonNodeRef = useRef<htmlRef & HTMLButtonElement>(null)

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

    useEffect(() => {
        fixTwoCNChar()
    })

    const renderButton = ({ getPrefixCls, autoInsertSpaceInButton }: ConfigConsumerProps) => {
        const prefixCls = getPrefixCls('btn', customizePrefixCls)
        const autoInsertSpace = autoInsertSpaceInButton !== false

        // large => lg
        // small => sm
        // let sizeCls = '';
        // switch (size) {
        //   case ''
        // }

        const classes = classNames(prefixCls, className, {
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace
        })

        const kids = children || children === 0 ? spaceChildren(children, isNeedInserted()) : null

        // const { htmlType, ...otherProps } = rest as NativeButtonProps;

        const bottonNode = (
            <button className={classes} ref={buttonNodeRef}>
                {kids}
            </button>
        )
        return bottonNode
    }

    return <ConfigConsumer>{renderButton}</ConfigConsumer>
}
Button.defaultProps = {
    loading: false
}

Button.propTypes = {
    type: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string
}

export default React.memo(Button)
