function currency(price){
    return price.toLocaleString("id-ID", {style:"currency", currency:"IDR"});
}

module.exports = {currency}