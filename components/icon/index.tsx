import * as React from 'react'
import * as allIcons from '@ant-design/icons/lib/dist'
import ReactIcon from '@ant-design/icons-react'

// Initial setting
ReactIcon.add(...Object.keys(allIcons).map(key => (allIcons as any)[key]))

export interface IconProps {
    type: string
    className?: string
}

const Icon = (props: IconProps) => {
    const { type, className } = props
    return <ReactIcon className={className} type={type} />
}

export default Icon
