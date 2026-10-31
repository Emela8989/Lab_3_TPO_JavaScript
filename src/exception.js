
//класс иисключение для промокода
class PromoError extends Error {
    constructor(message){
        super(message);
        this.name = "PromoError";
    }
}

//класс исключение для неправильного продукта
class ExcProduct extends Error {
    constructor(message){
        super(message);
        this.name = "ExcProduct";
    }
}

//класс исключение для неправильного количества
class ExcCount extends Error {
    constructor(message){
        super(message);
        this.name = "ExcCount";
    }
}

module.exports = PromoError, ExcCount, ExcProduct;