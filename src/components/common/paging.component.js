// Paging component
import React, { PropTypes } from 'react';
class GridPager extends React.Component {
    render() {
        var li = [];
        var pageCount = this.props.Size;
        for (var i = 1; i <= pageCount; i++) {
            if (this.props.currentPage == i) {
                li.push(<li key={i} className="active"><a href="#">{i}</a></li>);
            }
            else {
                li.push(<li key={i} ><a href="#" onClick={this.props.onPageChanged.bind(null, i)}>{i}</a></li>);
            }
        }
        return (
            <ul className="pagination">{li}</ul>
        );
    }
}

export default GridPager;