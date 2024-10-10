
function RemoveAds() {
    let AllAds = []
    AllAds.push(document.getElementsByTagName("iframe"))



    Array.from(AllAds).forEach(Ad => {
        Ad.remove()
    })
}

RemoveAds()