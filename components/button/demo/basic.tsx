import React, { useState } from 'react'
import Button, { ButtonSize } from '..'

type loadingType = boolean | { delay?: number }
const ButtonGroup = Button.Group

function Basic() {
    const size: ButtonSize[] = ['large', 'default', 'small']
    const [loading, enterLoading] = useState<loadingType>(false)
    const [iconLoading, enterIconLoading] = useState(false)

    return (
        <div>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="danger">Danger</Button>
            <Button type="link">Link</Button>
            <br />
            <Button type="primary" size={size[0]}>
                Primary
            </Button>
            <Button size={size[0]}>Normal</Button>
            <Button type="dashed" size={size[1]}>
                Dashed
            </Button>
            <Button type="danger" size={size[2]}>
                Danger
            </Button>
            <Button type="link" size={size[2]}>
                Link
            </Button>
            <br />
            <div>
                <Button type="primary" loading>
                    Loading
                </Button>
                <Button type="primary" size="small" loading={loading}>
                    333
                </Button>
                <br />
                <Button
                    type="primary"
                    // loading={loading}
                    onClick={() => enterLoading({ delay: 5000 })}
                >
                    Click me!
                </Button>
                <Button
                    type="primary"
                    loading={iconLoading}
                    onClick={() => enterIconLoading(!iconLoading)}
                >
                    Click me!
                </Button>
                <Button
                    onClick={() => {
                        enterLoading(!loading)
                        enterIconLoading(!iconLoading)
                    }}
                />
                <br />
                {/* <Button shape="circle" loading />
                <Button type="primary" shape="circle" loading /> */}
            </div>
            <div>
                <Button type="primary">Primary</Button>
                <Button type="primary" disabled>
                    Primary(disabled)
                </Button>
                <br />
                <Button>Default</Button>
                <Button disabled>Default(disabled)</Button>
                <br />
                <Button type="dashed">Dashed</Button>
                <Button type="dashed" disabled>
                    Dashed(disabled)
                </Button>
                <br />
                <Button type="link">Link</Button>
                <Button type="link" disabled>
                    Link(disabled)
                </Button>
                <div style={{ padding: '8px 8px 0 8px', background: 'rgb(190, 200, 200)' }}>
                    <Button ghost>Ghost</Button>
                    <Button ghost disabled>
                        Ghost(disabled)
                    </Button>
                </div>
            </div>
            <div style={{ background: 'rgb(190, 200, 200)', padding: '26px 16px 16px' }}>
                <Button type="primary" ghost>
                    Primary
                </Button>
                <Button ghost>Default</Button>
                <Button type="dashed" ghost>
                    Dashed
                </Button>
                <Button type="danger" ghost>
                    danger
                </Button>
                <Button type="link" ghost>
                    link
                </Button>
            </div>
            <div>
                <Button type="primary" block>
                    Primary
                </Button>
                <Button block>Default</Button>
                <Button type="dashed" block>
                    Dashed
                </Button>
                <Button type="danger" block>
                    Danger
                </Button>
                <Button type="link" block>
                    Link
                </Button>
            </div>
            <div>
                <h4>Basic</h4>
                <ButtonGroup>
                    <Button>Cancel</Button>
                    <Button>OK</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button disabled>L</Button>
                    <Button disabled>M</Button>
                    <Button disabled>R</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button>L</Button>
                    <Button>M</Button>
                    <Button>R</Button>
                </ButtonGroup>
                <h4>With Icon</h4>
                <ButtonGroup>
                    <Button type="primary">
                        {/* <Icon type="left" /> */}
                        Go back
                    </Button>
                    <Button type="primary">
                        Go forward
                        {/* <Icon type="right" /> */}
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button type="primary" icon="cloud" />
                    <Button type="primary" icon="cloud-download" />
                </ButtonGroup>
            </div>

            <div>
                <Button type="primary" shape="circle" icon="search" />
                <Button type="primary" icon="search">
                    Search
                </Button>
                <Button shape="circle" icon="search" />
                <Button icon="search">Search</Button>
                <br />
                <Button shape="circle" icon="search" />
                <Button icon="search">Search</Button>
                <Button type="dashed" shape="circle" icon="search" />
                <Button type="dashed" icon="search">
                    Search
                </Button>
            </div>
        </div>
    )
}

export default Basic
