if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('worker.js').then(
        registration => {
            if (registration)
                console.log(`Worker successfully installed with scope ${registration.scope}.`)
        }, err => {
            console.warn(`Worker failed to instal with error ${err}`)
        }
    )
}