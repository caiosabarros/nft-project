console.log("Hello")
let nome: string = "Caio"

let arrayOfStrings: Array<string>
= ['a','b']

let arr : string[] = ['a']

const concatenation: (x: Array<string>, y: Array<string>) => void = (x,y) => {
    x.push(y[0])
    console.log(x)
}

concatenation(arr,arrayOfStrings)

const tuppling: [string[], number[]] = ['Joao','Thiago', 1,8]

console.log(tuppling[0])
