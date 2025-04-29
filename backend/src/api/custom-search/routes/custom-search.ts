import path from "path";
import middlewares from "../../../../config/middlewares";

export default {
    routes: [
        {
            method: 'GET',
            path: '/custom-search',
            handler: 'custom-search.search',
            config: {
                policies: [],
                middlewares: []
            },
        },
    ]
};