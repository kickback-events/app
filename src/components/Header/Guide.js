import React, { Component } from 'react'
import styled from '@emotion/styled'
import c from '../../colours'

const GuideWrapper = styled('div')`
  margin-right: 2em;
  position: relative;
`

const Menu = styled('div')`
  position: absolute;
  border-radius: 6px;
  background: #f4f5ff;
  box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.1);
  white-space: nowrap;
  top: 100%;
  transform: translateY(10px);
`

const List = styled('ul')`
  list-style-type: none;
  margin: 0;
  & li:not(:first-child) {
    border-top: #eee solid 1px;
  }
`

const ListItem = styled('li')`
  padding: 10px 20px;
`

const GuideButton = styled('a')`
  color: white;
`

const Link = styled('a')`
  color: ${c.primary400};
`

export const links = [
  {
    label: 'Why Kickback',
    href:
      'https://medium.com/wearekickback/how-to-improve-attendance-of-your-events-2ba603ad954'
  },
  { label: 'Getting Started', href: '/gettingstarted' },
  {
    label: 'Using Tornado.cash',
    href:
      'https://medium.com/wearekickback/private-transactions-on-kickback-events-using-tornado-cash-1705a1d31167'
  },
  { label: 'FAQ', href: '/faq' },
  {
    label: 'Event Organiser guide',
    href:
      'https://medium.com/wearekickback/kickback-event-organiser-guide-c2146c12defb'
  }
]

export default class Guide extends Component {
  constructor() {
    super()

    this.state = {
      showMenu: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu(event) {
    event.preventDefault()
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  render() {
    return (
      <GuideWrapper>
        <GuideButton href="#guide" onClick={this.toggleMenu}>
          Guides
        </GuideButton>

        {this.state.showMenu ? (
          <Menu>
            <List>
              {links.map(l => (
                <ListItem>
                  <Link href={l.href}>{l.label}</Link>
                </ListItem>
              ))}
            </List>
          </Menu>
        ) : null}
      </GuideWrapper>
    )
  }
}
