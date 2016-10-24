import React from 'react';
import ReactDOM from 'react-dom';

export default class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            config: this.props.config
        };
    }

    renderLeftMenu(element){
        var btnClass = "ui basic button";
        if (element.color) {
            btnClass = "ui "+element.color+" button";
        }
        if (element.type && element.type === 'text') {
            return <h3 className="ui header" onClick={element.onClick}>{element.text}</h3>
        } else if(element.type !== 'text' && element.icon) {
            return <button className={btnClass} onClick={element.onClick}><i className={element.icon}/>{element.text}</button>
        } else {
            return <button className={btnClass} onClick={element.onClick}>{element.text}</button>
        }
    }

    renderCenterMenu(element){
        var vm = this;
        if (typeof element === 'string') {
            return <h3 className="ui header">{element}</h3>;
        } else {
            return(
                <div className="ui buttons">
                    { element.map(function(element, key){
                        return (
                            <button key={key} className={vm.activeClassBtn(element)} onClick={element.onClick}>{element.text}</button>
                        )
                    }) }
                </div>
            )
        }
    }

    activeClassBtn(element){
        if (element.active) {
            return "ui active button";
        } else {
            return "ui button";
        }
    }

    onSearch(e){
        if (this.state.config.onSearch){
            this.state.config.onSearch(e);
        }
    }

    render(){
        var vm = this;
        var leftArea = [];
        if (this.state.config.left){
            leftArea = this.state.config.left;
        }
        var centerArea = '';
        if (this.state.config.center){
            centerArea = this.state.config.center;
        }

        var rightArea = [];
        if (this.state.config.right) {
            rightArea = this.state.config.right;
        }

        return(
            <div className="ui navbar">

                <div className="ui menu">
                    {/*<a href="" className="item icon sidebars">
                        <i className="large sidebar icon"></i>
                    </a>*/}
                    <div className="item" style={{flex:1}}>
                        { leftArea.map(function(element, key){
                            return (
                                <element key={key}>
                                    { vm.renderLeftMenu(element) }
                                </element>
                            )
                        }) }
                    </div>
                    <div className="item" style={{flex:2,marginLeft:-46,justifyContent: 'center', alignItems:'center'}}>
                        {this.renderCenterMenu(centerArea)}
                    </div>
                    <div className="menu right" style={{flex:1, justifyContent:'flex-end'}}>
                        {/*<div className="item">
                            <a href="" className="ui inverted button">Upgrade</a>
                            </div>
                            <a href="" className="item">
                            <i className="ticon small light actions skrooge_credit_card"/>
                        </a>*/}
                        <div className="item">
                            { rightArea.length === 0 && (
                                <div className="ui icon input">
                                    <input type="text" ref="keyword" onKeyUp={this.onSearch.bind(this)} placeholder="Search..."/>
                                    <i className="search icon"></i>
                                </div>
                            ) }

                            { rightArea.length > 0 && (
                                rightArea.map(function(element, key){
                                    return (
                                        <element key={key}>
                                            { vm.renderLeftMenu(element) }
                                        </element>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
