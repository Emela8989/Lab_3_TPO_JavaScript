const product = require("../src/product.js");
const PromoError = require("../src/exception.js");
const ExcProduct = require("../src/exception.js");
const ExcCount = require("../src/exception.js");

class ShoppingCart{

    //статическое свойство класса ShoppingCart, хранящее коды, специально заморожено, чтобы в ходе программы его нельзя было изменить  
    static PROMOS =  Object.freeze(
        {
            "DISCOUNT10": 0.10,
            "DISCOUNT20": 0.20,
            "DISCOUNT50": 0.50,
        }
    )

    constructor (){
        this.array = {};
        this.discount = 0.0;
    }

    //метод добавляющий товар в корзину
    add(id, stock, data){
        if (stock <= 0)
            throw new ExcCount("Некорректное количество товара.");
        for (let x of data){//берем товар со склада
            if (x.id == id){//проверяем, есть ли он на складе
                if (x.getStock() >= stock){//если добавляемое количество не больше количества на складе
                    //либо увеличиваем количество
                    if (id in this.array)
                        this.array[id] += stock;
                    //либо добавляем новый товар в корзину
                    else
                        this.array[id] = stock;

                    //уменьшаем количество товара на складе
                    let current = x.getStock();
                    x.setStock(current - stock);

                    return this.array;
                }
                else
                    throw new ExcCount("Количество добавляемых товаров больше, чем есть на складе.")
            }
        }
        throw new ExcProduct("Данный товар отсутствует на складе.");
    }

    //уменьшение количества товара на складе
    lessCount(id, stock, data){
        //если товар имеется в корзине
        if (id in this.array){
            //количество в корзине больше либо равно входному и входное количество неотрицательное
            if (this.array[id] >= stock && stock > 0)
            {
                //уменьшаем количество в корзине
                this.array[id] -= stock;
                //если количество в корзине равно нулю, то удаляем из корзины
                if (this.array[id] == 0)
                    delete this.array[id];

                //находим товар на складе и возвращаем количество обратно
                for (let x of data){
                    if (x.id == id)
                    {
                        let current = x.getStock();
                        x.setStock(current + stock);
                        break;
                    }
                }

                return this.array;
            }
            else
                throw new ExcCount("Некорректно введенное количество товара.");
        }
        else
            throw new ExcProduct("Данного товара нет в корзине.");
    }

    //удаление товара из корзины
    delProduct(id, data){
        //если товар в корзине есть
        if (id in this.array){
            //ищем его на складе
            for (let x of data){
                //если товар на складе есть, удаляем его из корзины и вовзвращаем его количество на склад
                if (x.id == id)
                {
                    let current = x.getStock();
                    x.setStock(current + this.array[id]);
                    delete this.array[id];
                    return this.array;
                }
            }
            //Редкий случай, при котором в корзине товар есть, а на складе его нет
            throw new ExcProduct("Данный товар отсутсвует на складе");

        }
        throw new ExcProduct("Данного товара нет в корзине.");
    }


    //поиск полной стоимости корзины
    allCost(data){
        //если корзина не пустая
        if (Object.keys(this.array).length != 0){
            let cost = 0;
            const keys = Object.keys(this.array);
            //находим соответствующий товар на складе, умножаем цену на количество
            for (let x of data)
            {
                if (x.id in this.array)
                    cost += this.array[x.id] * x.getPrice(); 
            }

            return cost - cost * this.discount;
        }

        throw new ExcProduct("Корзина пуста!");
    }

    //метод для присваивания скидки
    promoDis(code){
        if (code in ShoppingCart.PROMOS)
            this.discount = ShoppingCart.PROMOS[code];
        else
            throw new PromoError("Неверный промокод!");

    }
}

module.exports = ShoppingCart;