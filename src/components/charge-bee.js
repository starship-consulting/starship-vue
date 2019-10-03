import { Services, Component } from 'starship';

let ChargeBeeService = Services.ChargeBeeService;

export default Component('charge-bee', {

    properties: {
        $site: ''
    },
    
    ready() {
        ChargeBeeService.init(this.site);
    },
    
    render() {
    }
});