;(function (root, factory) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(require("react"));
    } else if (typeof define === "function" && define.amd) {
        define(["react"], factory);
    } else {
        root.ReactTagsInput = factory(root.React);
    }
})(this, function (React) {
  "use strict";

  var Input = React.createClass({
    render: function () {
      var ns = this.props.ns;

      var inputClass = ns + "tagsinput-input "
        + (this.props.invalid ? ns + "tagsinput-invalid" : "");

      return React.createElement("input",
        // https://gist.github.com/sebmarkbage/a6e220b7097eb3c79ab7
        // avoid dependency on ES6's `Object.assign()`
        React.__spread({}, this.props, {
          type: "text"
        , className: inputClass
        , placeholder: this.props.placeholder
        })
      );
    }
  });

  var Tag = React.createClass({
    render: function () {
      return (
        React.createElement("span", {
          className: this.props.ns + "tagsinput-tag"
        }, this.props.tag + " ", React.createElement("a", {
          onClick: this.props.remove
          , className: this.props.ns + "tagsinput-remove"
        }))
      );
    }
  });

  var TagsInput = React.createClass({
    getDefaultProps: function () {
      return {
        tags: []
        , placeholder: "Add a tag"
        , validate: function (tag) { return tag !== ""; }
        , addKeys: [13, 9]
        , removeKeys: [8]
        , onTagAdd: function () { }
        , onTagRemove: function () { }
        , onChange: function () { }
        , classNamespace: "react"
      };
    }

    , getInitialState: function () {
      return {
        tags: []
        , tag: ""
        , invalid: false
      };
    }

    , componentWillMount: function () {
      this.setState({
        tags: this.props.tags.slice(0)
      });
    }

    , componentWillReceiveProps: function (nextProps) {
      this.setState({
        tags: nextProps.tags.slice(0)
      });
    }

    , getTags: function () {
      return this.state.tags;
    }

    , addTag: function () {
      var tag = this.state.tag.trim();

      if (this.state.tags.indexOf(tag) !== -1 || !this.props.validate(tag)) {
        return this.setState({
          invalid: true
        });
      }

      this.setState({
        tags: this.state.tags.concat([tag])
        , tag: ""
        , invalid: false
      }, function () {
        this.props.onTagAdd(tag);
        this.props.onChange(this.state.tags);
        this.inputFocus();
      });
    }

    , removeTag: function (i) {
      var tags = this.state.tags.slice(0);
      var tag = tags.splice(i, 1);
      this.setState({
        tags: tags
        , invalid: false
      }, function () {
        this.props.onTagRemove(tag[0]);
        this.props.onChange(this.state.tags);
      });
    }

    , onKeyDown: function (e) {
      var add = this.props.addKeys.indexOf(e.keyCode) !== -1
        , remove = this.props.removeKeys.indexOf(e.keyCode) !== -1;

      if (add) {
        e.preventDefault();
        this.addTag();
      }

      if (remove && this.state.tags.length > 0 && this.state.tag === "") {
        this.removeTag(this.state.tags.length - 1);
      }
    }

    , onChange: function (e) {
      this.setState({
        tag: e.target.value
        , invalid: false
      });
    }

    , onBlur: function (e) {
      if (this.state.tag !== "" && !this.state.invalid) {
        this.addTag();
      }
    }

    , inputFocus: function () {
      this.refs.input.getDOMNode().focus();
    }

    , render: function() {
      var ns = this.props.classNamespace === "" ? "" : this.props.classNamespace + "-";

      var tagNodes = this.state.tags.map(function (tag, i) {
        return React.createElement(Tag, {
          key: i
          , ns: ns
          , tag: tag
          , remove: this.removeTag.bind(null, i)
        });
      }.bind(this));

      return (
        React.createElement("div", {
          className: ns + "tagsinput"
        }, tagNodes, React.createElement(Input, {
          ref: "input"
          , ns: ns
          , placeholder: this.props.placeholder
          , value: this.state.tag
          , invalid: this.state.invalid
          , onKeyDown: this.onKeyDown
          , onChange: this.onChange
          , onBlur: this.onBlur
        }))
      );
    }
  });

  return TagsInput;
});
