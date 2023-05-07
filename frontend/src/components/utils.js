export function sortPriceDescending(data) {
    return data.sort((a, b) => (a.unitPrice > b.unitPrice) ? 1 : -1)
}

export function sortPriceAscending(data) {
    return data.sort((a, b) => (a.unitPrice < b.unitPrice) ? 1 : -1)
}

export function sortComment(data) {
    return data.sort((a, b) => (a.comments.length < b.comments.length) ? 1 : -1)
}

export function sortRate(data) {
    return data.sort((a, b) => (a.rate < b.rate) ? 1 : -1)
}