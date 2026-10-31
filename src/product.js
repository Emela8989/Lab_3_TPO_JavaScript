class Product{

    //класс Product, со специальными сеттерами
    //к полям price и stock нельзя обратиться как к остальным полям
    //для присваения им значения созданы сеттеры, чтобы не присваивать отрицательные значения

    #price
    #stock
    constructor(id, name, price, stock){
        this.id = id;
        this.name = name;
        this.#price = price;
        this.#stock = stock;
    }



    getPrice() {return this.#price};
    getStock() {return this.#stock};
    setPrice(price){
        if (price >= 0)
            this.#price = price;
        else 
            throw Error("Неверная цена для товара.");
    }

    setStock(stock){
        if (stock >= 0)
            this.#stock = stock;
        else
            throw Error("Нверное количество товара.")
    }
    
}

module.exports = Product; 
