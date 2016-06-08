define(function (require) {


    var React = require('react');
    var Method = require('./components/Method.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            var item = this.props.item;
            item.name = 'this.' + item.interface;
            return (
                <div className="parser-properties">
                    <Method item={item}/>
                </div>
            );
        }
    });
});
