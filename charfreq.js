// Esta classe extende a Map, entao o método get() retorna o valor específico ao inves de nulo quando nao encontrado no map
class DefaultMap extends Map {
    constructor(defaultValue){
        super(); // invocar o construtor da superclasse
        this.defaultValue = defaultValue; // guarda o valor padrao
    }

    get(key){
        if(this.has(key)){      // se a chave está no Map
            return super.get(key);  // retorna o valor da superclasse
        }else{  // se nao estiver no Map
            return this.defaultValue;  // retorna o valor padrao
        }
    }
}


// Essa classe calcula e exibe o histograma de frequencia de letras
class Histogram {
    constructor() {
        this.letterCounts = new DefaultMap(0);  // Map de contador de Letras
        this.totalLetters = 0; // quantas Letras tem ao todo
    }

    // esta funcao atualiza o histograma com as letras do texto
    add(text){
        
        // remove os espacos em branco e converte as letras para maiusculo
        text = text.replace(/\s/g, "").toUpperCase();

        // percore os caracteres do texto
        for(let character of text){
            let count = this.letterCounts.get(character); // recebe o contador atual da letra
            this.letterCounts.set(character, count+1);  // incrementa
            this.totalLetters++;
        }

    }

    toString() {

        // converte o Map para uma array com [chave, valor]
        let  entries = [...this.letterCounts];

        // Ordena o array por contagem, depois alfabeticamente
        entries.sort((a,b) => {         // a funcao pra definir a ordem da ordenacao
            if(a[1] == b[1]) {          // se a contagem for igual,
                return a[0] < b[0] ? -1 : 1;    //  ordena alfabeticamente
            }else{                              // se nao
                return b[1] - a[1];             // ordena pelo de maior contador
            }
        });


        // converte a contagem em porcentagem
        for(let entry of entries) {
            entry[1] = entry[1] / this.totalLetters*100;
        }

        // filtra os resultadors para maiores que 1%
        entries = entries.filter( entry => entry[1] >= 1);

        // converte as entradas para linha de texto
        let lines = entries.map(
            ([l,n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
        );
        
        //retorna as linhas concatenadas, separados por quebra de linha
        return lines.join("\n");
    }
}

// Esta funcao async (Promise-returning) cria um objeto Histograma,
// "assincronicamente" lê os pedaços do texto em formato padrao, e adiciona estes pedacos ao histograma.
// Quando o percurso termina retorna o histograma
async function histogramFromStdin(){
    process.stdin.setEncoding("UTF-8"); // Leitura de Strings Unicode, não em bytes
    let histogram = new Histogram();
    for await (let chunk of process.stdin){
        histogram.add(chunk);
    }
    return histogram
}

// Essa linha final do programa é o main body do programa
// Cria o histograma a partir da entrada padrao e imprime
histogramFromStdin().then(histogram => { console.log(histogram.toString()); });