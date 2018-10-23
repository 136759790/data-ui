import Index from './views/index.vue';
import db from './views/db.vue';
import im from './views/im.vue';
import configin from './views/configin.vue';
import configout from './views/configout.vue';
import thread from './views/thread.vue';
import filter from './views/filter.vue';
const routers = [
    {path: '/',component: Index},
    {path: '/Index',component: Index},
    {path: '/db',component: db},
    {path: '/im',component: im},
    {path: '/configin',component: configin},
    {path: '/configout',component: configout},
    {path: '/thread',component: thread},
    {path: '/filter',component: filter},
];
export default routers;