import {PrismaClient} from '@prisma/client'
import  _ from 'lodash'
import { Logger } from 'tslog'
import nqdm from 'nqdm'

import  Reader   from './reader'
import { ProcessEntry } from './process_entry'

const log : Logger = new Logger()

class Processor {
  private reader: Reader
  private prismaClient: PrismaClient

  constructor(reader: Reader, prismaClient: PrismaClient) {
    this.reader = reader
    this.prismaClient = prismaClient
  }

  async main(){
    // SMALL ETL
    let results: any[] = await this.reader.open()
    results =  results.filter(this.preProcess)
    results = results.map(this.transform)
    const prisma = this.prismaClient
    let e: any
    for await (const entry of nqdm(results)) {
      e = new ProcessEntry(entry, prisma)
      await e.execute()
    }
    return results
  }

  transform(entry: any ) {
    entry.city = _.capitalize(entry.city)
    if(entry.city === "") {
      entry.city = _.split(entry.address, ',')[0]
    }
    entry.year = _.split(entry.phase, 'Q')[0]
    entry.province = _.capitalize(entry.province_territory)
    return entry
  }

  preProcess(entry: any): Boolean {
    // console.log(entry)
    let city = entry["city"]
    let province = entry["province_territory"]
    let address = entry["address"]
    let phase = entry["phase"]
    let year = parseInt(_.split(phase, 'Q')[0])
    if (city === "") {
      city = _.split(address, ',')[0]
    }

    if( province === ""){
      return false
    }
    if( !phase.includes('Q') ){
      return false
    }
    if (year < 2021) {
      return false
    }
    return true
  }

}

export default  Processor
