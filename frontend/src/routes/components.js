export const App=resolve=>{
    require.ensure(['../components/App.vue'],()=>{
        resolve(require('../components/App.vue'));
    })
};

export const CompanyInfo=resolve=>{
    require.ensure(['../components/Company/info/info.vue'],()=>{
        resolve(require('../components/Company/info/info.vue'));
    })
};

export const CompanyGraph=resolve=>{
    require.ensure(['../components/Company/graph/graph.vue'],()=>{
        resolve(require('../components/Company/graph/graph.vue'));
    })
};

export const SeniorInfo=resolve=>{
    require.ensure(['../components/Senior/info/info.vue'],()=>{
        resolve(require('../components/Senior/info/info.vue'));
    })
};

export const SeniorGraph=resolve=>{
    require.ensure(['../components/Senior/graph/graph.vue'],()=>{
        resolve(require('../components/Senior/graph/graph.vue'));
    })
};
