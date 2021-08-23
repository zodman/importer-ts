import csvParse from 'csv-parse'
import * as fs from 'fs'
import nqdm from 'nqdm'

import { Logger } from 'tslog'

const log : Logger = new Logger()

class ReaderCSV {
    private filepath: string

    constructor(filepath: string) {
        this.filepath = filepath
    }

    async open () {
      let results: any[] = []
      log.info("proccesing csv")
      const parser = fs.createReadStream(this.filepath).pipe(csvParse({ columns: true}))
      for await ( const row of parser ) {
        results.push(row)
      }
      log.info("processing finished")
      return results
    }
}

export default  ReaderCSV
