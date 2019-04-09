import React from 'react';
import AuthorizedComponent from '../authorization/authorizedComponent';

class InvoicesContainer extends AuthorizedComponent {
    constructor(props, context) {
        super(props, context);
        this.handleBreadCrumbs = this.handleBreadCrumbs.bind(this);
    }

    handleBreadCrumbs(data) {
        this.props.breadCrumbs(data);
    }

    render() {
        let children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                breadCrumb: this.handleBreadCrumbs.bind(this)
            })
        }.bind(this));
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default InvoicesContainer;
