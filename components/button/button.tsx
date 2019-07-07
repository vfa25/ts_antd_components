import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { tuple } from '../_util/type';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';


const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
// const isTwoCNChar = val => rxTwoCNChar.test(val)
// 两种方式对比，前者可防止test方法被重写

function isString(str: any): boolean {
  return typeof str === 'string';
}

// 该辅助函数用于优化 child 为基本类型时的渲染
function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure: boolean = false;
  const childList: React.ReactNode[] = [];
  React.Children.forEach(children, child => {
    const type = typeof child;
    const isCurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1;
      const lastChild = childList[lastIndex];
      childList[lastIndex] = `${lastChild}${child}`;
    } else {
      childList.push(child);
    }
    isPrevChildPure = isCurrentChildPure;
  })

  // Pass to React.Children.map to auto fill key
  return React.Children.map(childList, child =>
    insertSpace(child as React.ReactChild, needInserted)
  )
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactChild, needInserted: boolean) {
  // Check the child if is undefined or null.
  if (child == null) return;
  const SPACE = needInserted ? ' ' : '';
  // strictNullChecks oops.
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(child.props.children)
  ) {
    return React.cloneElement(child, {}, child.props.children.split('').join(SPACE));
  }
  if (typeof child === 'string') {
    if (isTwoCNChar(child)) {
      child = child.split('').join(SPACE);
    }
    return <span>{child}</span>;
  }
  return child;
}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger', 'link');
export type ButtonType = (typeof ButtonTypes)[number];

export interface BaseButtonProps {
  type?: ButtonType;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
}

// 定义交差类型
export type AnchorButtonProps = {
  href: string
} & BaseButtonProps;

export type ButtonProps = Partial<AnchorButtonProps>;

interface ButtonState {
  loading?: boolean | { delay?: number };
  hasTwoCNChar?: boolean;
}

class Button extends React.Component<ButtonProps, ButtonState> {
  static defultProps = {
    loading: false
  }

  static propTypes = {
    type: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
  }

  static getDerivedStateFromProps(nextProps: ButtonProps, prevState: ButtonState) {
    if (nextProps.loading instanceof Boolean) {
      return {
        ...prevState,
        loading: nextProps.loading,
      }
    }
    return null;
  }

  private buttonNode: HTMLElement | null;

  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      loading: props.loading,
      hasTwoCNChar: false,
    }
  }

  componentDidMount() {
    this.fixTwoCNChar();
  }

  // 缓存ref
  saveButtonRef = (node: HTMLElement | null) => {
    this.buttonNode = node;
  }

  fixTwoCNChar() {
    // 边缘情况处理
    // Fix for HOC usage like <FormatMessage />
    if (!this.buttonNode) {
      return;
    }
    const buttonText = this.buttonNode.textContent || this.buttonNode.innerHTML;
    if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!this.state.hasTwoCNChar) {
        this.setState({
          hasTwoCNChar: true,
        })
      }
    } else if (this.state.hasTwoCNChar) {
      this.setState({
        hasTwoCNChar: false,
      })
    }
  }

  isNeedInserted() {
    const { children } = this.props;
    return React.Children.count(children) === 1;
  }

  renderButton = ({ getPrefixCls, autoInsertSpaceInButton }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      type,
      children,
      className,
      ...rest
    } = this.props;
    const { loading, hasTwoCNChar } = this.state;
    console.log(rest, loading);

    const prefixCls = getPrefixCls('btn', customizePrefixCls);
    const autoInsertSpace = autoInsertSpaceInButton !== false;

    // large => lg
    // small => sm
    // let sizeCls = '';
    // switch (size) {
    //   case ''
    // }

    const classes = classNames(prefixCls, className, {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
    })

    const kids =
      children || children === 0
        ? spaceChildren(children, this.isNeedInserted())
        : null;

    // const { htmlType, ...otherProps } = rest as NativeButtonProps;

    const bottonNode = (
      <button
        className={classes}
        ref={this.saveButtonRef}
      >
        {kids}
      </button>
    )
    return bottonNode;
  }

  render() {
    return <ConfigConsumer>{this.renderButton}</ConfigConsumer>
  }
}

polyfill(Button);

export default Button;
