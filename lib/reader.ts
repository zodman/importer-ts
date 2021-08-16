import csvParse from 'csv-parse'
import * as fs from 'fs'


export interface IReader {
  open(): Promise<any[]>
}

class ReaderCSV implements IReader {
    private filepath: string

    constructor(filepath: string) {
        this.filepath = filepath
    }

    async open () {
      let results: any[] = []
      const parser = fs.createReadStream(this.filepath).pipe(csvParse({ columns: true}))
      for await ( const row of parser ) {
        results.push(row)
      }
      return results 
    }
}

export default  ReaderCSV
