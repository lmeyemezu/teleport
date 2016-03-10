var React = require('react');

const GrvTableTextCell = ({rowIndex, data, columnKey, ...props}) => (
  <GrvTableCell {...props}>
    {data[rowIndex][columnKey]}
  </GrvTableCell>
);

var GrvSortHeaderCell = React.createClass({
  getInitialState() {
    this._onSortChange = this._onSortChange.bind(this);
  },

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  },

  _onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
});

/**
* Sort indicator used by SortHeaderCell
*/
const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC'
};

const SortIndicator = ({sortDir})=>{
  let cls = 'grv-table-indicator-sort fa fa-sort'
  if(sortDir === SortTypes.DESC){
    cls += '-desc'
  }

  if( sortDir === SortTypes.ASC){
    cls += '-asc'
  }

  return (<i className={cls}></i>);
};

/**
* Sort Header Cell
*/
var SortHeaderCell = React.createClass({
  render() {
    var {sortDir, columnKey, title, ...props} = this.props;

    return (
      <GrvTableCell {...props}>
        <a onClick={this.onSortChange}>
          {title}
        </a>
        <SortIndicator sortDir={sortDir}/>
      </GrvTableCell>
    );
  },

  onSortChange(e) {
    e.preventDefault();
    if(this.props.onSortChange) {
      // default
      let newDir = SortTypes.DESC;
      if(this.props.sortDir){
        newDir = this.props.sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
      }
      this.props.onSortChange(this.props.columnKey, newDir);
    }
  }
});

/**
* Default Cell
*/
var GrvTableCell = React.createClass({
  render(){
    var props = this.props;
    return props.isHeader ? <th key={props.key} className="grv-table-cell">{props.children}</th> : <td key={props.key}>{props.children}</td>;
  }
});

/**
* Table
*/
var GrvTable = React.createClass({

  renderHeader(children){
    var cells = children.map((item, index)=>{
      return this.renderCell(item.props.header, {index, key: index, isHeader: true, ...item.props});
    })

    return <thead className="grv-table-header"><tr>{cells}</tr></thead>
  },

  renderBody(children){
    var count = this.props.rowCount;
    var rows = [];
    for(var i = 0; i < count; i ++){
      var cells = children.map((item, index)=>{
        return this.renderCell(item.props.cell, {rowIndex: i, key: index, isHeader: false, ...item.props});
      })

      rows.push(<tr key={i}>{cells}</tr>);
    }

    return <tbody>{rows}</tbody>;
  },

  renderCell(cell, cellProps){
    var content = null;
    if (React.isValidElement(cell)) {
       content = React.cloneElement(cell, cellProps);
     } else if (typeof props.cell === 'function') {
       content = cell(cellProps);
     }

     return content;
  },

  render() {
    var children = [];
    React.Children.forEach(this.props.children, (child, index) => {
      if (child == null) {
        return;
      }

      if(child.type.displayName !== 'GrvTableColumn'){
        throw 'Should be GrvTableColumn';
      }

      children.push(child);
    });

    var tableClass = 'table ' + this.props.className;

    return (
      <table className={tableClass}>
        {this.renderHeader(children)}
        {this.renderBody(children)}
      </table>
    );
  }
})

var GrvTableColumn = React.createClass({
  render: function() {
    throw new Error('Component <GrvTableColumn /> should never render');
  }
})

export default GrvTable;
export {
  GrvTableColumn as Column,
  GrvTable as Table,
  GrvTableCell as Cell,
  GrvTableTextCell as TextCell,
  SortHeaderCell,
  SortIndicator,
  SortTypes};
