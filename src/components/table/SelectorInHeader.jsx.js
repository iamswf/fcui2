/**
 * @file 表头列选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var language = require('../../core/language');
    var Layer = require('../../Layer.jsx');
    var List = require('../../List.jsx');
    var cTools = require('../../core/componentTools');
    var tools = require('../../core/tableTools');


    var SELECT_MODE = {
        CURRENT_PAGE: '2',
        ALL: '3'
    };
    var SELECT_COMMAND = {
        CURRENT_PAGE: '-2',
        CLEAR: '-3'
    };


    function getInformationFromTable(table) {
        var selected = tools.getSelected(table.___getValue___());
        return {
            i: tools.getSelectedCount(selected),
            workMode: table.props.flags.showSelector + ''
        }
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                fieldConfig: {},
                tableComponent: {},
                datasource: [
                    {label: language.tableSelector.selectCurrentPage, value: '-2'},
                    {label: language.tableSelector.selectAll, value: '-1'}
                ]
            };
        },
        // @override
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        // @override
        componentDidUpdate: function () {
            var table = this.props.tableComponent;
            var info = getInformationFromTable(table);
            var mainCheckbox = this.refs.mainCheckbox;
            if (info.workMode === SELECT_MODE.CURRENT_PAGE) {
                mainCheckbox.indeterminate = info.i > 0 && info.i < table.props.datasource.length;
            }
            else {
                mainCheckbox.indeterminate = info.i !== -1 && info.i > 0;
            }
        },
        onListClick: function (e) {
            this.setState({layerOpen: false});
            this.props.tableComponent.onRowSelect(e);
        },
        onMainSelectorChange: function (e) {
            var table = this.props.tableComponent;
            var info = getInformationFromTable(table);
            e.target = this.refs.container;
            if (info.workMode === SELECT_MODE.CURRENT_PAGE) {
                e.target.value = info.i === table.props.datasource.length
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            else {
                // 如果是全选或当页全选，则取消所有选择；否则选中当前页
                e.target.value = (info.i === -1 || info.i === table.props.datasource.length)
                    ? SELECT_COMMAND.CLEAR : SELECT_COMMAND.CURRENT_PAGE;
            }
            this.props.tableComponent.onRowSelect(e);
        },
        render: function () {
            var table = this.props.tableComponent;
            var info = getInformationFromTable(table);
            var containerProp = {
                className: 'table-selector fcui2-dropdownlist',
                onMouseEnter: cTools.openLayerHandler.bind(this),
                onMouseLeave: cTools.closeLayerHandler.bind(this),
                ref: 'container'
            };
            var mainCheckboxProp = {
                type: 'checkbox',
                checked: info.i === -1
                    || (info.workMode === SELECT_MODE.CURRENT_PAGE && info.i === table.props.datasource.length),
                className: 'td-selector',
                disabled: table.props.disabled,
                ref: 'mainCheckbox',
                onClick: this.onMainSelectorChange
            };
            if (info.workMode === SELECT_MODE.CURRENT_PAGE || info.workMode === SELECT_MODE.ALL) {
                return (
                    <th>
                        <div ref="container" className="table-selector fcui2-dropdownlist">
                            <input {...mainCheckboxProp}/>
                        </div>
                    </th>
                );
            }
            var layerProp = {
                 isOpen: this.state.layerOpen && !table.props.disabled,
                 anchor: this.refs.container,
                 location: 'bottom top right',
                 onMouseLeave: cTools.closeLayerHandler.bind(this),
                 ref: 'layer'
            };
            return (
                <th className="th-header">
                    <div {...containerProp}>
                        <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                        <input {...mainCheckboxProp}/>
                        <Layer {...layerProp}>
                            <List datasource={this.props.datasource} onClick={this.onListClick}/>
                        </Layer>
                    </div>
                </th>
            );
        }
    });
});