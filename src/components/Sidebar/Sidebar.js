import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem} from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav'
import {
    NavbarToggler,
    NavbarBrand,
} from 'reactstrap';

class Sidebar extends Component {

    handleClick(e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open');
    }

    activeRoute(routeName, props) {
        // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
        return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    // todo Sidebar nav secondLevel
    // secondLevelActive(routeName) {
    //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    // }


    render() {

        const props = this.props;
        const activeRoute = this.activeRoute;
        const handleClick = this.handleClick;

        // badge addon to NavItem
        const badge = (badge) => {
            if (badge) {
                const classes = classNames( badge.class );
                return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
            }
        };

        // simple wrapper for nav-title item
        const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

        // nav list section title
        const title =  (title, key) => {
            const classes = classNames( "nav-title", title.class);
            return (<li key={key} className={ classes }>{wrapper(title)} </li>);
        };

        // nav list divider
        const divider = (divider, key) => (<li key={key} className="divider"></li>);

        // nav item with nav link
        const navItem = (item, key) => {
            const classes = classNames( "nav-link", item.class);
            return (
                <NavItem key={key}>
                    <NavLink to={item.url} className={ classes } activeClassName="active">
                        <i className={item.icon}></i>{item.name}{badge(item.badge)}
                    </NavLink>
                </NavItem>
            )
        };

        // nav dropdown
        const navDropdown = (item, key) => {
            return (
                <li key={key} className={activeRoute(item.url, props)}>
                    <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick.bind(this)}><i className={item.icon}></i> {item.name}</a>
                    <ul className="nav-dropdown-items">
                        {navList(item.children)}
                    </ul>
                </li>)
        };

        // nav link
        const navLink = (item, idx) =>
            item.title ? title(item, idx) :
                item.divider ? divider(item, idx) :
                    item.children ? navDropdown(item, idx)
                        : navItem(item, idx) ;

        // nav list
        const navList = (items) => {
            return items.map( (item, index) => navLink(item, index) );
        };

        // sidebar-nav root
        return (
            <div className="sidebar">
                <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarMinimize}>&#9776;</NavbarToggler>
                <div className="sidebar-header">
                    <img src={'img/avatars/1.gif'} className="img-avatar" alt="Avatar"/>
                    <div><strong>Master Yoda</strong></div>
                    <div className="text-muted"><small>Founder &amp; CEO Re-ports</small></div>
                    <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                        <button type="button" className="btn btn-link">
                            <i className="icon-settings"></i>
                        </button>
                        <button type="button" className="btn btn-link">
                            <i className="icon-speech"></i>
                        </button>
                        <button type="button" className="btn btn-link">
                            <i className="icon-user"></i>
                        </button>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <Nav>
                        {navList(nav.items)}
                    </Nav>
                </nav>
            </div>
        )
    }
}

export default Sidebar;
