const CACHE_NAME = 'localworker'

const askForPushPermission = () => new Promise((res, rej) => {
    Notification.requestPermission().then(res, rej)
})

const subscribeToPushNotifications = () => askForPushPermission.then(registration => {
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            'BD45rY2sdeIE2SwoiohfkJju22b7EISivJpXvj2ns3FIkHzGVlLiwpiM8at3bRul6pFdQB_3b4yG_svcKYO1Gg8'
        )
    }
    return registration.pushManager.subscribe(subscribeOptions)
}).then(subscription => {
    console.log(`Received push subscription: ${JSON.stringify(subscription)}`)
    return subscription
})

const reportSubscription = subscription => {
    return fetch('/report_subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    }).then(response => {
        if (!response.ok)
            throw new Error("Bad status code from server")
        return response.json()
    }).then(data => {
        return data
    })
}

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then( () => {
            console.log(`Cache ${CACHE_NAME} opened`)
        })
    )
    evt.waitUntil(
        navigator.Notification.requestPermission().then(permission => {
            if (permission !== 'granted')
                throw new Error(`Permission not granted. Got status ${permission} instead.`)
        })
    )
})

