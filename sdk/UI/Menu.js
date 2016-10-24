/**
* Bismillaahirrohmaanirrohiim
* Menu Component for Transformatika Web Platform
* initial release
*/

import React from 'react';

export default class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active: this.props.active,
            menu: []
        };
    }
    componentDidMount(){
        /** GET MENU FROM DATABASE */
        this.requestMenu = () => {
            $.ajax({
                url: CONFIG.server.url+'/menu/',
                dataType: 'json',
                success: function(res) {
                    this.setState({
                        menu: res.records
                    })
                }.bind(this)
            });
        }

        // this.requestMenu();
        setTimeout(function(){

            var variant = '';

            if (this.props.variant){
                if (this.props.variant === 'dark') {
                    variant = 'inverted';
                }
            }

            $('.ui.side').niceScroll({
                cursorcolor: "transparent",
                cursorborder: "transparent",
                horizrailenabled: false
            });
            $('.item.popups').popup({
               inline: false,
               hoverable: true,
               position: 'right center',
               variation: variant,
               delay: {
                   show: 400,
                   hide: 400
               }
           });
           var currentURL = window.location.href;
           $('.item.popups').each(function(){
               var link = $(this).attr('href');
               if (currentURL.indexOf(link) > 0) {
                   $(this).addClass('active');
               }
           });
           $('.ui.side').niceScroll();
       }.bind(this), 0);
    }
    componentWillUnmount() {
        //this.requestMenu.abort();
        $('.item.popups').popup('destroy');
        $('.ui.side').getNiceScroll().remove();
    }
    render(){
        return (
            <div className="ui side" style={{overflowY: 'hidden', outline: 'none'}}>
                <div className="ui vertical menu sides">
                    <a href="/#/dashboard" className="item active brand">
                        <img src="assets/img/start.png" alt=""/>
                    </a>
                    {
                        this.state.menu.map((value, key) =>
                            <a href="" className="item popups" key={key} data-content={value.Name} data-variation="tiny">
                                <img src={value.Icon}/>
                            </a>
                        )
                    }
                    <a href="/#/store" className="item popups" title="Software Center">
                        <i className="ion-bag ion-medium"/>
                    </a>
                    <a href="/#/settings" className="item popups" title="Settings">
                        <i className="ion-android-options ion-medium"/>
                    </a>

                </div>
            </div>
        )
    };
}
