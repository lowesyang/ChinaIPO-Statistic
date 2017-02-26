export const LS={       //localStorage
    getItem(key){
        let temp=localStorage.getItem(key);
        let res;
        if(res=JSON.parse(temp)) return res;
        return temp;
    },
    setItem(key,value){
        if(typeof value=='object') {
            localStorage.setItem(key,JSON.stringify(value));
        }
        else localStorage.setItem(key,value);
    },
    removeItem:localStorage.removeItem,
    clear(){
        localStorage.clear();
    }
}

export const SS={       //sessionStorage
    getItem(key){
        let temp=sessionStorage.getItem(key);
        let res;
        if(res=JSON.parse(temp)) return res;
        return temp;
    },
    setItem(key,value){
        if(typeof value=='object') {
            sessionStorage.setItem(key,JSON.stringify(value));
        }
        else sessionStorage.setItem(key,value);
    },
    removeItem:sessionStorage.removeItem,
    clear(){
        sessionStorage.clear();
    }
};

export function deepClone(obj){
    if(typeof obj == 'object') {
        if (obj instanceof Array) {
            let temp = [];
            for (let i = 0; i < obj.length; i++) {
                temp.push(obj[i]);
            }
            return temp;
        }
        else{
            let newObj={};
            for(let key in obj){
                newObj[key]=deepClone(obj[key]);
            }
            return newObj;
        }
    }
    else return obj;
}