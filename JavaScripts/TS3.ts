export namespace TS3 {
    //调试log
    export let log = (...args) => {
        //console.error('ts3', ...args)
    }

    export let info = (...args) => {
        console.info('--TS3Info--', ...args)
    }
}